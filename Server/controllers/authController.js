const User=require("../models/User");

exports.registerUser=async(req,res)=>{
    const{username}=req.body;
    try {//let=mutable-can be changed
        let user=await User.findOne({username});
        if(!user) user=await User.create({username});//if no user lets change vr user by registering 
        res.json(user);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}