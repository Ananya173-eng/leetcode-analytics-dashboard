import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');
    const secret = process.env.JWT_SECRET || 'super_secret_codepulse_key_123';
    
    const decoded = jwt.verify(token, secret);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Authentication failed. Invalid or expired token.' });
  }
};

export default auth;
