const ChatModel = require('../models/chat')
const mongoose = require('mongoose')

async function socketEvents(io) {
	
    io.on('connection', function(socket) {

        socket.on('join room', function(room, user) {

            //Sace user
            socket.user = user

            //Join user
            socket.join(room);
        })

        socket.on('new message', async function(room, message) {
        	// console.log(socket.user,room)
            //Send message to all joined users
            let messageData = {
                user : socket.user? socket.user._id : null,
                message,
                Date : new Date()
            }
            io.sockets.in(room).emit('message', messageData);

        	let findQuery = { room }
        	let updateQuery = { 
        		$push : { 
        			chats : {
        				user : socket.user,
        				message
        			}
        		} 
        	}
        	let options = { new:true,upsert:true }
        	let newChat = await ChatModel.findOneAndUpdate(findQuery,updateQuery,options)
        })
    })
    return io
}

module.exports = socketEvents