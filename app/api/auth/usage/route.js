import { adminAuth } from '../../../lib/firebase-admin';
import { checkUsage, ensureUser } from '../../../lib/usage';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (token) {
      // Logged-in user
      const decoded = await adminAuth.verifyIdToken(token);
      const userData = await ensureUser(
        decoded.uid,
        decoded.email,
        decoded.name,
        decoded.picture
      );
      const usage = await checkUsage(decoded.uid, null);
      return Response.json({
        loggedIn: true,
        uid: decoded.uid,
        email: decoded.email,
        displayName: decoded.name || '',
        photoURL: decoded.picture || '',
        ...usage,
      });
    }

    // Anonymous user - use IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    const anonId = Buffer.from(ip).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
    const usage = await checkUsage(null, anonId);

    return Response.json({
      loggedIn: false,
      ...usage,
    });
  } catch (error) {
    console.error('Usage check error:', error);
    return Response.json({ error: 'Usage check failed' }, { status: 500 });
  }
}
