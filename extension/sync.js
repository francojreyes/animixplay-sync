// Based off Sync Watch
// https://github.com/Semro/syncwatch/blob/2aa16e42a5bbda122dbfdf1bb133da709aea442e/plugin/js/content.js
let recieved = false;
let recievedEvent;
let loading = false;
let socket;
let video;

function openSocket() {
    if (!socket) {
        socket = new WebSocket('wss://animixplay-sync.herokuapp.com/');
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
    if (!video) return;
    recieved = true;
    recievedEvent = event.type;

    console.log(event);

    switch (event.type) {
        case 'playing': {
            video.currentTime = event.currentTime;
            video.play();
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

function onProgress(event) {
    const prevLoading = loading;
    loading = event.target.readyState < event.target.HAVE_FUTURE_DATA;
    if (prevLoading === false && loading === true) {
      broadcast(event);
    }
  }

function onEvent(event) {
    console.log(recieved, event.type);
    if (recieved) {
        if (recievedEvent === 'play') {
            if (event.type === 'progress') {
                onProgress(event);
                recieved = false;
            } else if (event.type === 'playing') {
                recieved = false;
            }
        } else if (recievedEvent === 'pause') {
            if (event.type === 'seeked') {
                recieved = false;
            }
        } else if (recievedEvent === event.type) {
            recieved = false;
        }
    } else if (event.type === 'seeked') {
        if (event.target.paused) broadcast(event);
    } else if (event.type === 'progress') {
        onProgress(event);
    } else {
        broadcast(event);
    }
}

function sync() {
    openSocket();
    video = document.querySelector('video');
    const events = ['playing', 'pause', 'seeked', 'progress', 'waiting'];
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