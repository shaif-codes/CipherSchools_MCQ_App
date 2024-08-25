const jwt = require('jsonwebtoken');


// System check route
exports.systemCheck = (req, res) => {
    const { testId } = req.body;
  
    // Perform backend validation and generate a token
    const systemCheckToken = jwt.sign({ testId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
    // Send the token back to the frontend
    res.status(200).json({ token: systemCheckToken });
  };
  
  // System check verification route
exports.verifySystemCheck = (req, res) => {
    const { token } = req.body;
  
    try {
      // Verify the system check token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        return res.status(200).json({ message: 'System check passed' });
      }
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized: system check failed' });
    }
  };
  