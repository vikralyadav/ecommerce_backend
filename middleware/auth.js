const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')


module.exports.userAuth = async (req, res, next)=>{
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({message: unauthorized})
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decode.id);

        if(!user){
            return res.status(401).json({message: 'unauthorized'});
        }

        req.user= user;

        next();

    }catch(err){
        return res.status(500).json({message: err}); 


    }
}