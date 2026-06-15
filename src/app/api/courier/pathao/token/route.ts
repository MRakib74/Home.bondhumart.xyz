import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientId, clientSecret, email, password, baseUrl } = body;

    if (!clientId || !clientSecret || !email || !password) {
      return NextResponse.json({ error: 'All fields are required to generate Pathao token.' }, { status: 400 });
    }

    const apiUrl = baseUrl ? baseUrl.replace(/\/$/, '') : 'https://api-hermes.pathao.com';

    const response = await fetch(`${apiUrl}/aladdin/api/v1/issue-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        username: email,
        password: password,
        grant_type: 'password'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ 
        error: data.error_description || data.message || 'Failed to generate token. Please check your credentials.' 
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in
    });

  } catch (error: any) {
    console.error('Pathao token error:', error);
    return NextResponse.json({ error: 'Internal server error while communicating with Pathao API' }, { status: 500 });
  }
}
