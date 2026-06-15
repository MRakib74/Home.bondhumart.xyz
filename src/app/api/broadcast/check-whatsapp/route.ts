import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { baseUrl, apiKey, instance, phones } = body;

    if (!baseUrl || !apiKey || !instance || !phones || phones.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const results = [];

    for (const phone of phones) {
      try {
        // Clean phone number - ensure it has country code
        let cleanPhone = phone.replace(/[^0-9]/g, '');
        // Add Bangladesh country code if missing
        if (cleanPhone.startsWith('0')) {
          cleanPhone = '88' + cleanPhone;
        } else if (!cleanPhone.startsWith('88')) {
          cleanPhone = '88' + cleanPhone;
        }

        // Evolution API: Check if number is on WhatsApp
        const res = await fetch(`${baseUrl}/chat/whatsappNumbers/${instance}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey
          },
          body: JSON.stringify({
            numbers: [cleanPhone]
          })
        });

        if (res.ok) {
          const data = await res.json();
          // Evolution API returns array of results
          if (Array.isArray(data) && data.length > 0) {
            results.push({
              phone,
              exists: data[0]?.exists === true,
              jid: data[0]?.jid || null
            });
          } else {
            results.push({ phone, exists: false, jid: null });
          }
        } else {
          // If API call fails for this number, mark as unknown (assume exists)
          results.push({ phone, exists: true, jid: null });
        }
      } catch (err) {
        // On error for individual number, assume exists
        results.push({ phone, exists: true, jid: null });
      }
    }

    return NextResponse.json({ success: true, results });

  } catch (error: any) {
    console.error('WhatsApp check error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
