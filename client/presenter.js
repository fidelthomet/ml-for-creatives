let serverIP = "localhost";

const socket = new WebSocket(`ws://${serverIP}:8080`);
const id = `${Math.random()}`;

socket.addEventListener('open', function (event) {
    socket.send(`init/${id}`)
})

socket.addEventListener('message', ({data}) => {
    console.log('received', data)
    if (data.split('/')[0] === 'done' && data.split('/')[1] != id) {
        console.log('do something')
    }
})