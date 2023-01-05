export const isSuper = (req, res, next) => {
    console.log('super:', req)
    if (req.role === "user_pusat" || req.role === "user_polda" || req.role === "user_polres") {
        return res.status(403).render('error', {
            title: 'Error 403',
            status: 403,
            message: "Forbidden access.",
            desc: "Anda tidak memiliki akses untuk halaman ini.",
            role: req.role
        });
    }
    next()
};