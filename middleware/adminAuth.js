const jwt = require('jsonwebtoken');


const auth = async (req, res, next) => {
        try {
            const bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
                const bearer = bearerHeader.split(' ');
                const token = bearer[1];
                const admin = jwt.verify(token, process.env.JWT_SECRET);
                req.user = admin;
                next();
            }else{
                res.sendStatus(401).json({message:"no token provided"})
            }
        } catch (e) {
            res.status(403).send({ error: 'invalid or expired token' });
        }
    };

module.exports = auth;