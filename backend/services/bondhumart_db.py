"""
BondhuMart Direct Database Integration Service
একই সার্ভারে থাকা Laravel MySQL ডেটাবেজ থেকে সরাসরি ডেটা পড়ে।
"""

import os
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta

# DB সংযোগের জন্য
try:
    import pymysql
    DB_AVAILABLE = True
except ImportError:
    DB_AVAILABLE = False


def get_db_connection():
    """BondhuMart এর MySQL ডেটাবেজে সংযোগ স্থাপন করে।"""
    if not DB_AVAILABLE:
        raise Exception("pymysql ইন্সটল করা নেই। সার্ভারে: pip install pymysql")

    return pymysql.connect(
        host=os.getenv("BM_DB_HOST", "localhost"),
        port=int(os.getenv("BM_DB_PORT", "3306")),
        user=os.getenv("BM_DB_USER", ""),
        password=os.getenv("BM_DB_PASS", ""),
        database=os.getenv("BM_DB_NAME", ""),
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        connect_timeout=5,
    )


def get_dashboard_stats() -> Dict[str, Any]:
    """
    ড্যাশবোর্ডের জন্য মূল পরিসংখ্যান:
    - আজকের অর্ডার ও আয়
    - মোট অর্ডার ও আয়
    - স্ট্যাটাস ব্রেকডাউন
    """
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            today = datetime.now().date()
            week_ago = today - timedelta(days=7)
            month_ago = today - timedelta(days=30)

            # আজকের অর্ডার
            cursor.execute("""
                SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as revenue
                FROM orders
                WHERE DATE(created_at) = %s
                AND status NOT IN ('cancelled', 'returned')
            """, (today,))
            today_stats = cursor.fetchone()

            # এই সপ্তাহের অর্ডার
            cursor.execute("""
                SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as revenue
                FROM orders
                WHERE DATE(created_at) >= %s
                AND status NOT IN ('cancelled', 'returned')
            """, (week_ago,))
            week_stats = cursor.fetchone()

            # এই মাসের অর্ডার
            cursor.execute("""
                SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as revenue
                FROM orders
                WHERE DATE(created_at) >= %s
                AND status NOT IN ('cancelled', 'returned')
            """, (month_ago,))
            month_stats = cursor.fetchone()

            # স্ট্যাটাস অনুযায়ী অর্ডার সংখ্যা
            cursor.execute("""
                SELECT status, COUNT(*) as count
                FROM orders
                WHERE DATE(created_at) >= %s
                GROUP BY status
                ORDER BY count DESC
            """, (month_ago,))
            status_breakdown = cursor.fetchall()

            # পেন্ডিং অর্ডার (জরুরি — প্রসেস করা দরকার)
            cursor.execute("""
                SELECT COUNT(*) as count FROM orders
                WHERE status IN ('pending', 'incomplete')
            """)
            pending = cursor.fetchone()

            # মোট কাস্টমার
            cursor.execute("SELECT COUNT(*) as count FROM customers")
            total_customers = cursor.fetchone()

            # কম স্টক প্রোডাক্ট
            cursor.execute("""
                SELECT COUNT(*) as count FROM products
                WHERE stock <= low_stock_threshold AND status = 'active'
            """)
            low_stock = cursor.fetchone()

            return {
                "today": {
                    "orders": today_stats["count"],
                    "revenue": float(today_stats["revenue"])
                },
                "this_week": {
                    "orders": week_stats["count"],
                    "revenue": float(week_stats["revenue"])
                },
                "this_month": {
                    "orders": month_stats["count"],
                    "revenue": float(month_stats["revenue"])
                },
                "pending_orders": pending["count"],
                "total_customers": total_customers["count"],
                "low_stock_products": low_stock["count"],
                "status_breakdown": {row["status"]: row["count"] for row in status_breakdown}
            }
    finally:
        conn.close()


def get_recent_orders(limit: int = 20, status: Optional[str] = None, days: int = 30) -> List[Dict]:
    """সাম্প্রতিক অর্ডারগুলো পড়ে।"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            since = datetime.now() - timedelta(days=days)
            query = """
                SELECT
                    o.id, o.customer_name, o.customer_phone,
                    o.customer_address, o.customer_district,
                    o.total_amount, o.delivery_charge,
                    o.total_buying_price, o.status,
                    o.payment_method, o.created_at, o.updated_at,
                    o.tracking_code, o.courier_status
                FROM orders o
                WHERE o.created_at >= %s
            """
            params = [since]

            if status:
                query += " AND o.status = %s"
                params.append(status)

            query += " ORDER BY o.created_at DESC LIMIT %s"
            params.append(limit)

            cursor.execute(query, params)
            orders = cursor.fetchall()

            # datetime অবজেক্ট স্ট্রিং-এ রূপান্তর
            for order in orders:
                for key in ["created_at", "updated_at"]:
                    if isinstance(order.get(key), datetime):
                        order[key] = order[key].isoformat()
                # মুনাফা হিসাব
                total = float(order.get("total_amount") or 0)
                buying = float(order.get("total_buying_price") or 0)
                delivery = float(order.get("delivery_charge") or 0)
                order["profit"] = round(total - buying - delivery, 2)

            return orders
    finally:
        conn.close()


def get_customer_segments() -> Dict[str, Any]:
    """
    BondhuMart এর customers টেবিল থেকে সেগমেন্টেড কাস্টমার লিস্ট পড়ে।
    WhatsApp Broadcast এর জন্য।
    """
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Hot Buyers: গত ৭ দিনে অর্ডার করেছে
            cursor.execute("""
                SELECT name, phone, total_orders, total_spent, city, district, last_order_date
                FROM customers
                WHERE last_order_date >= %s
                ORDER BY total_spent DESC
                LIMIT 200
            """, (datetime.now() - timedelta(days=7),))
            hot_buyers = cursor.fetchall()

            # VIP: মোট ৫০০০+ টাকা খরচ করেছে
            cursor.execute("""
                SELECT name, phone, total_orders, total_spent, city, district, last_order_date
                FROM customers
                WHERE total_spent >= 5000
                ORDER BY total_spent DESC
                LIMIT 100
            """)
            vip = cursor.fetchall()

            # ইনঅ্যাক্টিভ: ৩০ দিনের বেশি অর্ডার নেই
            cursor.execute("""
                SELECT name, phone, total_orders, total_spent, city, district, last_order_date
                FROM customers
                WHERE last_order_date < %s AND total_orders >= 1
                ORDER BY last_order_date DESC
                LIMIT 200
            """, (datetime.now() - timedelta(days=30),))
            inactive = cursor.fetchall()

            # সবাই (broadcast এর জন্য)
            cursor.execute("""
                SELECT name, phone, total_orders, total_spent, district
                FROM customers
                WHERE phone IS NOT NULL AND phone != ''
                ORDER BY last_order_date DESC
                LIMIT 500
            """)
            all_customers = cursor.fetchall()

            def format_list(rows):
                for row in rows:
                    for key in ["last_order_date"]:
                        if isinstance(row.get(key), (datetime, type(datetime.now().date()))):
                            row[key] = str(row[key])
                return rows

            return {
                "hot_buyers": format_list(list(hot_buyers)),
                "vip_customers": format_list(list(vip)),
                "inactive_customers": format_list(list(inactive)),
                "all_customers": format_list(list(all_customers)),
                "summary": {
                    "hot_buyers_count": len(hot_buyers),
                    "vip_count": len(vip),
                    "inactive_count": len(inactive),
                    "total_count": len(all_customers)
                }
            }
    finally:
        conn.close()


def get_products(low_stock_only: bool = False, limit: int = 50) -> List[Dict]:
    """প্রোডাক্ট লিস্ট পড়ে।"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            query = """
                SELECT id, name, slug, price, buying_price, stock,
                       low_stock_threshold, status, created_at
                FROM products
            """
            if low_stock_only:
                query += " WHERE stock <= low_stock_threshold AND status = 'active'"
            query += " ORDER BY stock ASC LIMIT %s"

            cursor.execute(query, (limit,))
            products = cursor.fetchall()

            for p in products:
                if isinstance(p.get("created_at"), datetime):
                    p["created_at"] = p["created_at"].isoformat()
                p["profit_margin"] = round(
                    float(p.get("price", 0)) - float(p.get("buying_price", 0)), 2
                )

            return list(products)
    finally:
        conn.close()


def check_db_connection() -> Dict[str, Any]:
    """ডেটাবেজ কানেকশন চেক করে।"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) as total FROM orders")
            result = cursor.fetchone()
        conn.close()
        return {
            "status": "connected",
            "message": "✅ BondhuMart ডেটাবেজ সফলভাবে কানেক্ট হয়েছে!",
            "total_orders": result["total"]
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"❌ কানেকশন ব্যর্থ: {str(e)}",
            "total_orders": 0
        }
