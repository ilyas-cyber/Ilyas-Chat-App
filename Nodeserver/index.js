//Node server which handle i socket io connection

const io = require('socket.io')(8000)

const users = {};

io.on('connection', socket => {
    //If any new user joins, let other users connected to the server know! 
    socket.on('new-user-joined', name => {
        console.log("New user");
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    //If someone sends a message, broaddcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });
    //If someone Leaves the chat, let others know
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});
