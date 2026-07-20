export const isAdmin = (req, res, next) => {
    // Check karo ki user logged in hai te ohda role 'admin' hai
    if (req.user && req.user.role === 'admin') {
        next(); // Permission granted
    } else {
        res.status(403).json({ success: false, message: "Access Denied: Admins Only!" });
    }
};

