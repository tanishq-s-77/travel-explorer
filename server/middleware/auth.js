import { supabase } from '../services/supabaseAdmin.js';

/**
 * Middleware to verify Supabase JWT token from Authorization header
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization header. Please log in to continue.'
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access token not provided.'
    });
  }

  if (!supabase) {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'Supabase authentication service is not configured on the server. Please check server/.env'
    });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired session. Please log in again.',
        details: error?.message
      });
    }

    // Attach user to request
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.error('[requireAuth] Token verification error:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to verify session token.'
    });
  }
}
