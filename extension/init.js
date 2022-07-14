// Add a new sync button next to play
// Possibly add a popup for sessions
ready('.plyr__controls', function (controls) {  
    const btn = document.createElement("button");
    btn.classList.add("plyr__controls__sync", "plyr__control");
    btn.addEventListener('click', () => {
        console.log('button pressed');
        sync();
    });

    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("icons/18.png");
    btn.appendChild(img);

    controls.prepend(btn);
});