//Real Time comms
const Message=require("../models/Message");
const User=require("../models/User");

module.exports=(io)=>{
    //Fire up connection
    //Connection=event
    //socket=taking from frontend and connecting to backend
    io.on("connection",(socket)=>{
        console.log("Socket connected:",socket.id);//Log all connections by the id

        //joinRoom=event
        socket.on("joinRoom",async({username,roomId})=>{
            //find user and update
            const user=await User.findOneAndUpdate(
                {username},
                {socketId:socket.id,isOnline:true},
                {nwe:true}
            );
            socket.join(roomId);//Join room using rooId
            io.to(roomId).emit("User Joined",{user,roomId});//announcing presence to room

            //typing
            socket.on("typing",()=>{
                socket.to(roomId).emit("Typing",username);
            });
            //Stop Typing
            socket.on("stopTyping",()=>{
                socket.to(roomId).emit("stopTyping",username);
            });
            //Send Message
            //async=going to data base carrying DATA
            //sendMessaeg=event
            socket.on("sendMessage",async(data)=>{
                const message=await Message.create({ 
                    sender:user._id,
                    room:roomId,
                    content:data
                });
                const fullMessage=await message.populate("sender","username");
                io.to("roomId").emit("newMessage",fullMessage);
            });
            //Disconnect
            //under connection
            socket.on("disconnect",async()=>{
                const offlineUser=await User.findOneAndUpdate(
                    {socketId:socket.id},
                    {isOnline:false},

                );
                io.emit("useroffline",offlineUser.username);
            });

        });
    });
}