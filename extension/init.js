// Add a new sync button next to play
// Possibly add a popup for sessions
ready('.plyr__controls', function (controls) {  
    const div = document.createElement("div");
    div.classList.add("plyr__controls__item", "plyr__menu");

    const btn = document.createElement("button");
    btn.classList.add("plyr__sync", "plyr__control");
    btn.type = "button";
    btn.addEventListener('click', () => {
        console.log('button pressed');
        sync();
    });

    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("icons/unpressed.svg");
    img.onerror = chrome.runtime.getURL("icons/unpressed.png");
    img.classList.add("plyr__sync__img");

    const span = document.createElement("span");
    span.classList.add("plyr__tooltip");
    span.textContent = "Sync";

    btn.appendChild(img);
    btn.appendChild(span);
    div.appendChild(btn);
    controls.prepend(div);
});