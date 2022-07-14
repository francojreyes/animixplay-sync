const sync = () => {
    const socket = new WebSocket('wss://animixplay-sync.herokuapp.com/')
    const video = document.querySelector('video');
    const player = document.querySelector('div.plyr');
    const poster = document.querySelector('div.plyr__poster');
    const button = document.querySelector('button[data-plyr="play"]');

    // Add listeners for user inputs
    function sendState(event) {
        const data = {
            time: video.currentTime,
            paused: video.paused  ||
                    video.readyState < video.HAVE_FUTURE_DATA,
        }
        // For some reason these two sources are inverted
        if (event.target == player || event.target === poster) {
            data.paused = !data.paused;
        }

        socket.send(JSON.stringify(data));
    }

    // All possible event sources - 
    // - 'click' (button[data-plyr="play"])
    button.addEventListener('click', sendState);
    // - 'click' (div.plyr__poster)
    poster.addEventListener('click', sendState);
    // - 'keydown' (div.plyr)
    player.addEventListener('keydown', (event) => {
        if (event.key == 'k' || event.key == ' ') {
            sendState(event);
        }
    });
    // - 'waiting i.e. readyState < HAVE_FUTURE_DATA (video)
    video.addEventListener('waiting', (event) => {
        if (video.readyState < video.HAVE_FUTURE_DATA) {
            sendState(event);
        }
    });
    // - 'seeked' (video)
    video.addEventListener('seeked', sendState);

    // Handle incoming messages from server
    // If we receive data with paused = true, pause and change time
    // If we receive data with play = true, play
    function updateState(msg) {
        const data = JSON.parse(msg);
        console.log(data);

        // If pause state and times are in sync, continue
        if (
            data.paused === video.paused &&
            Math.abs(data.time - video.currentTime) < 1
        ) {
            return;
        }

        // Invert state, update time if paused
        if (data.paused) {
            video.pause();
            video.currentTime = data.time;
        } else {
            video.play();
        }
    }
    socket.addEventListener('message', ({ data }) => {
        updateState(data)
    });
}