import jwt from 'jsonwebtoken';

export const userMiddleware = async(req, res, next) => 
    {
        const {token} = req.cookies;
        if(!token){
            return res.status(401).json({success: false, message: "Unauthorized access"});
        }

        try {
            const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      req.body = req.body || {};
      req.body.userId = tokenDecode.id; 
      next() ;
      
    } else {
      return res.json({ success: false, message: 'Not Authorized. Login Again.' });
    }
        } catch (error) {
            return res.status(401).json({success: false, message: error.message});
        }
    }    