import { NextResponse } from 'next/server';
import { loadProfile } from '../../../lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const user = await loadProfile(userId);
    return NextResponse.json({
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    });
  } catch (err) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}
