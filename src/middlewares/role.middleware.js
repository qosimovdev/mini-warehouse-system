function roleGuard(role) {
    return function (req, res, next) {
        if (req.user?.role === role) {
            next();
        } else {
            res.status(403).json({ message: "Forbidden" });
        }
    };
}

module.exports = roleGuard;