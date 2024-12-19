const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()
const bcrypt = require('bcrypt');
const BlacklistedToken = require('../models/blacklistToken');




module.exports.register = async (req, res)=>{
    try{
        const {name, email, password} = req.body;
        const user= await userModel.findOne({email});

        if(user){
            res.status(401).json({message: 'user already exists'})
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = new userModel({ name, email, password: hash }); // Use hash here
        
        await newUser.save();
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.cookie('token', token);

        res.send({message: "user registered successfully"})




    }catch(error){
        res.status(500).json({message: error.message});

    }
}


module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(402).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token);

        res.send({ message: "Login successful" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        const blacklistedToken = new BlacklistedToken({ token });
        await blacklistedToken.save();

        res.clearCookie('token');

        res.send({ message: "Logout successful" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.profile = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.send(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

