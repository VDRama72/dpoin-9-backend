// ✅ FILE: backend/utils/notifier.js (Revisi untuk Model Chat Baru)

let ioInstance; 

const Chat = require('../models/Chat'); // Pastikan ini mengarah ke model Chat.js

exports.initSocketIO = (ioServer) => {
    ioInstance = ioServer; 

    ioInstance.on('connection', (socket) => {
        console.log(`Socket.IO server: A client connected: ${socket.id}`);

        socket.on('joinOrderRoom', (orderId) => {
            socket.join(orderId);
            console.log(`Socket ${socket.id} joined order room: ${orderId}`);
        });

        socket.on('sendMessage', async (messageData) => { 
            console.log('Socket.IO server: Received message:', messageData);
            try {
                // ✅ Sesuaikan pembuatan instance model Chat dengan field baru
                const newChatMessage = new Chat({ 
                    orderId: messageData.orderId,
                    senderRole: messageData.senderRole, // Sekarang field ini ada di model
                    senderId: messageData.senderId,     // Sekarang field ini ada di model
                    senderName: messageData.senderName, // Sekarang field ini ada di model
                    text: messageData.text,             // Sekarang field ini ada di model
                    timestamp: messageData.timestamp,
                });
                await newChatMessage.save();
                console.log('Socket.IO server: Message saved to DB:', newChatMessage._id);

                ioInstance.to(messageData.orderId.toString()).emit('chatMessage', newChatMessage.toObject()); 
            } catch (error) {
                console.error('Socket.IO server: Error handling sendMessage:', error);
                if (error.name === 'ValidationError') {
                    console.error('Socket.IO server: Chat message validation error:', error.errors);
                }
            }
        });

        socket.on('orderStatusChanged', (data) => { 
            console.log('Socket.IO server: Order status changed:', data);
            ioInstance.to(data.orderId.toString()).emit('orderUpdate', data.updatedOrder);
        });

        socket.on('leaveOrderRoom', (orderId) => {
            socket.leave(orderId);
            console.log(`Socket ${socket.id} left order room: ${orderId}`);
        });

        socket.on('disconnect', (reason) => {
            console.log(`Socket.IO server: Client disconnected (${socket.id}): ${reason}`);
        });
    });
};

exports.getIo = () => ioInstance;

exports.notifyDriver = (driverId, order) => {
    if (ioInstance) {
        console.log(`Socket.IO server: Notifying driver ${driverId} about order ${order._id}`);
    }
};