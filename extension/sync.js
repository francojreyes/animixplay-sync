// Based off Sync Watch
// https://github.com/Semro/syncwatch/blob/2aa16e42a5bbda122dbfdf1bb133da709aea442e/plugin/js/content.js
let recieved = false;
let recievedEvent;
let socket;

function openSocket() {
    if (!socket) {
        socket = new WebSocket('wss://animixsync.herokuapp.com/');
        socket.ping = setInterval(() => {
            socket.send(JSON.stringify({
                type: 'ping',
                data: null
            }));
        }, 30 * 1000);
        socket.addEventListener('close', () => {
            clearInterval(socket.ping);
            socket = null;
        });
    }
}

function broadcast(event) {
    if (!socket) return;
    const data = {
        type: event.type,
        currentTime: event.target.currentTime
    }
    socket.send(JSON.stringify({
        type: 'event',
        data: data,
    }));
}

function fireEvent(event) {
    const video = document.querySelector('video');
    recieved = true;
    recievedEvent = event.type;

    console.log(event);

    switch (event.type) {
        case 'playing': {
            video.currentTime = event.currentTime;
            video.play().catch((e) => console.log(e.toString()));
            break;
        }
        case 'waiting':
        case 'pause': {
            video.pause();
            video.currentTime = event.currentTime;
            break;
        }
        case 'seeked': {
            video.currentTime = event.currentTime;
            break;
        }
    }
}

function onEvent(event) {
    console.log(recieved, event.type);
    if (recieved) {
        if (recievedEvent === 'pause') {
            if (event.type === 'seeked') {
                recieved = false;
            }
        } else if (recievedEvent === 'waiting') {
            if (event.type === 'playing') {
                recieved = false;
            }
        } else if (recievedEvent === event.type) {
            recieved = false;
        }
    } else if (event.type === 'seeked') {
        if (event.target.paused) {
            broadcast(event);    
        }
    } else if (event.type === 'waiting') {
        if (event.target.readyState < event.target.HAVE_FUTURE_DATA) {
            broadcast(event);
        }
    } else {
        broadcast(event);
    }
}

function sync() {
    openSocket();
    const video = document.querySelector('video');
    const events = ['playing', 'pause', 'seeked', 'waiting'];
    for (const event of events) {
        video.addEventListener(event, onEvent, true);
    }
    socket.addEventListener('message', (msg) => {
        const data = JSON.parse(msg.data);
        if (data.type == 'event') {
            fireEvent(data.data);
        }
    });
}

function unsync() {
    if (socket) {
        socket.close();
    }
}