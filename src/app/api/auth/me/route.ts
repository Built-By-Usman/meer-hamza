import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const response = await fetch(`${apiBaseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If token expired on backend, clear cookie
      const res = NextResponse.json({ message: 'Session expired' }, { status: 401 });
      res.cookies.set('jwt_token', '', { expires: new Date(0), path: '/' });
      return res;
    }

    const user = await response.json();
    return NextResponse.json(user);
  } catch (err: any) {
    // Graceful local development fallback for mock logins
    if (token === 'mock-jwt-token-string') {
      return NextResponse.json({
        id: 'usr-2',
        email: 'usman@gmail.com',
        firstName: 'Usman',
        lastName: 'Data',
        role: 'user',
      });
    }
    return NextResponse.json({ message: 'Internal auth service connection error' }, { status: 502 });
  }
}
