document.addEventListener('DOMContentLoaded', () => {
    const rat = document.getElementById('rat');
    const moveInterval = 2000; // Time in milliseconds between movements
    const pauseTime = 500; // Time in milliseconds to stand still before turning and moving again
    const hideDuration = 3000; // Time in milliseconds to hide after click
    let angle = 0;
    let timeoutID;

    function getRandomPosition() {
        const x = Math.random() * (window.innerWidth - rat.clientWidth);
        const y = Math.random() * (window.innerHeight - rat.clientHeight);
        return { x, y };
    }

    function moveRat() {
        const newPosition = getRandomPosition();
        const dx = newPosition.x - rat.offsetLeft;
        const dy = newPosition.y - rat.offsetTop;
        angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // Adjusted by 90 degrees

        rat.style.transition = 'transform 0.5s'; // Only apply transform transition during pause
        rat.style.transform = `rotate(${angle}deg)`;

        setTimeout(() => {
            rat.style.transition = 'left 1s linear, top 1s linear'; // Apply movement transition after pause
            rat.style.left = `${newPosition.x}px`;
            rat.style.top = `${newPosition.y}px`;

            timeoutID = setTimeout(moveRat, moveInterval); // Move again after the interval
        }, pauseTime);
    }

    function runAway() {
        clearTimeout(timeoutID); // Clear the ongoing movement timeout
        const newPosition = getRandomPosition();
        rat.style.left = `${newPosition.x}px`;
        rat.style.top = `${newPosition.y}px`;

        // Resume normal skittering after hiding duration
        setTimeout(() => {
            moveRat();
        }, hideDuration);
    }

    // Set initial position
    const initialPosition = getRandomPosition();
    rat.style.left = `${initialPosition.x}px`;
    rat.style.top = `${initialPosition.y}px`;

    // Start moving the rat
    timeoutID = setTimeout(moveRat, moveInterval);

    // Add event listener for clicks to make the rat run away
    document.addEventListener('click', runAway);
});
