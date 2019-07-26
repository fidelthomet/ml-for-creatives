const host = 'ws://192.168.10.188:8080'
const socket = new WebSocket(host);
const id = `${Math.random()}`

socket.addEventListener('open', function (event) {
    socket.send(`init/${id}`)
})

socket.addEventListener('message', ({data}) => {
    if (data.split('/')[0] === 'done' && data.split('/')[1] != id) {
        console.log('do something')
    }
})

function done () {
    socket.send(`done/${id}`)
}
