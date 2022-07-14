// Add a new sync button next to play
// Possibly add a popup for sessions
ready('.plyr__controls', function (controls) {  
    const btn = document.createElement("button");
    btn.classList.add("plyr__controls__item", "plyr__menu");
    btn.id = "my-button";
    btn.addEventListener('click', () => {
        console.log('button pressed');
        sync();
    });
    controls.insertBefore(btn, controls.children[1]);
});