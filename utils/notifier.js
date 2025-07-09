// utils/notifier.js

let io = null;
const drivers = new Map();

function initSocketIO(_io) {
  io = _io;

  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    socket.on('register_driver', (driverId) => {
      drivers.set(driverId, socket.id);
      console.log(`👤 Driver ${driverId} registered`);
    });

    socket.on('disconnect', () => {
      for (const [driverId, socketId] of drivers.entries()) {
        if (socketId === socket.id) {
          drivers.delete(driverId);
          console.log(`🔌 Driver ${driverId} disconnected`);
          break;
        }
      }
    });
  });
}

function notifyDriver(driverIdOrRoom, orderData) {
  if (!io) {
    console.warn('⚠️ Socket.io belum diinisialisasi');
    return;
  }

  if (driverIdOrRoom === 'all') {
    io.emit('new_order', orderData);
  } else {
    const socketId = drivers.get(driverIdOrRoom);
    if (socketId) {
      io.to(socketId).emit('new_order', orderData);
    }
  }
}

module.exports = {
  initSocketIO,
  notifyDriver
};
