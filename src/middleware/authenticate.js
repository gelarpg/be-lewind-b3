const { verify } = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const header = req.headers['authorization'];

        if (header) {
            const bearer = header.split(' ');
            const token = bearer[1];

            verify(token, process.env.TOKEN_KEY, function (err, decoded) {
                if (err) {
                    // response if any error
                    return res.send({
                        auth: false,
                        message: "Error",
                        errors: err
                    }).status(505)
                } else {
                    req.authorization = 'Bearer ' + token;
                    req.user = {
                        id: decoded.user_id,
                        parent_id: decoded.parent_id,
                        polda_id: decoded.polda_id,
                        polres_id: decoded.polres_id,
                        role: decoded.role
                    }
                    next();
                }
            });
        } else {
            return res.status(403).send({ auth: false, message: 'Unauthorized.' });
        }
    } catch (error) {
        // Error response
        res.status(505).send({
            success: false,
            message: "Something wrong",
        })
    }
}

module.exports = auth;