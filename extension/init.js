// Add a new sync button next to play
// Possibly add a popup for sessions
ready('.plyr__controls', function (controls) {  
    const btn = document.createElement("button");
    btn.classList.add("plyr__controls__item", "plyr__control", "plyr__controls__sync");
    btn.addEventListener('click', () => {
        console.log('button pressed');
        sync();
    });

    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("icons/24.png");
    btn.appendChild(img);

    controls.prepend(btn);
});