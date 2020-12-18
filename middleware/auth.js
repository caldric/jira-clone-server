const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Obtain token from header
    const token = req.header('x-auth-token');

    // Validation: token must be provided
    if (!token) {
      return res
        .status(401)
        .json({ error: 'No authentication token; access denied' });
    }

    // Validation: verify provided token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res
        .status(401)
        .json({ error: 'Token verification failed; access denied' });
    }

    req.user = verified.id;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = auth;
