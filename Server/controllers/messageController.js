//gets all messages in a specific chat room (using the room ID in the URL),
const Message=require("../models/Message");

exports.getRoomMessages=async(req,res)=>{//Only get messages where the room field  equal to the room id from the URL
    const messages=await Message.find({room:req.params.roomId})//messages that match
    .populate('sender','username')//adds the sender's username (from another collection),
    .sort({createdAt:1});//Ascending=sorts the messages in order (oldest first),
    res.json(messages);
};

