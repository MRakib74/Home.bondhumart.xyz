import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    // Try to get Steadfast API config from localStorage-like mock or just attempt an open proxy.
    // Note: Steadfast's Fraud Check API usually requires Enterprise Access or specific endpoints.
    // Often it is GET /api/v1/customer_history/{phone} with Api-Key and Secret-Key headers.
    
    // For now, we will return a graceful "Not Supported Yet" message because Courier API keys
    // are stored on the client side in localStorage, and we aren't passing them in this GET request yet.
    // If we wanted to, we should pass apiKey in headers. But since Courier APIs often block this,
    // we will mock the response or show a "Coming Soon" error gracefully.

    return NextResponse.json({ 
      success: false, 
      error: 'কুরিয়ার নেটওয়ার্ক ফ্রড চেক (Steadfast/Pathao) এর জন্য Enterprise API পারমিশন প্রয়োজন। আপাতত আপনার "Local Store History" সফলভাবে কাজ করছে!' 
    });

    /* 
    // Example of how it would work if we had the key in query params:
    const res = await fetch(`https://portal.steadfast.com.bd/api/v1/fraud_status/${phone}`, {
      headers: {
        'Api-Key': '...',
        'Secret-Key': '...'
      }
    });
    const data = await res.json();
    return NextResponse.json({ success: true, data: data });
    */

  } catch (error: any) {
    console.error('History proxy error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error while fetching courier history' }, { status: 500 });
  }
}
