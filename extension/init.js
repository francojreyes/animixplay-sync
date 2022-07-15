function press(btn) {
    if (btn.pressed === true) return;
    btn.pressed = true;
    
    const img = btn.querySelector('img');
    img.src = chrome.runtime.getURL('icons/pressed.svg');
    img.onerror = chrome.runtime.getURL('icons/pressed.png');

    const span = btn.querySelector('span');
    span.textContent = "Synced!";

    sync();
}

function unpress(btn) {
    if (btn.pressed === false) return;
    btn.pressed = false;
    
    const img = btn.querySelector('img');
    img.src = chrome.runtime.getURL('icons/unpressed.svg');
    img.onerror = chrome.runtime.getURL('icons/unpressed.png');

    const span = btn.querySelector('span');
    span.textContent = "Sync";

    unsync();
}

// Add a new sync button next to play
ready('.plyr__controls', function (controls) {  
    const btn = document.createElement("button");
    btn.classList.add("plyr__controls__item", "plyr__control", "plyr__sync");
    btn.type = "button";
    btn.pressed = false;

    const img = document.createElement("img");
    img.classList.add("plyr__sync__img");
    img.src = chrome.runtime.getURL('icons/unpressed.svg');
    img.onerror = chrome.runtime.getURL('icons/unpressed.png');
    btn.appendChild(img);

    const span = document.createElement("span");
    span.classList.add("plyr__tooltip", "sync__tooltip");
    span.textContent = "Sync";
    btn.appendChild(span);

    btn.addEventListener('click', (event) => {
        const btn = event.currentTarget;
        (btn.pressed ? unpress : press)(btn);
    }, true);

    controls.prepend(btn);
});