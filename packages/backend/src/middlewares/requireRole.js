// Use after `auth`: only let the listed roles through (role comes from the signed JWT)
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.role)) {
    return res.status(403).json({ status: false, message: "You do not have permission to do this" });
  }
  next();
};

module.exports = requireRole;
