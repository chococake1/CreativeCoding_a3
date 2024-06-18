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
        let offscreenX, offscreenY;

        // Determine offscreen position
        if (Math.random() > 0.5) {
            offscreenX = Math.random() > 0.5 ? -rat.clientWidth : window.innerWidth;
            offscreenY = Math.random() * window.innerHeight;
        } else {
            offscreenX = Math.random() * window.innerWidth;
            offscreenY = Math.random() > 0.5 ? -rat.clientHeight : window.innerHeight;
        }

        const dx = offscreenX - rat.offsetLeft;
        const dy = offscreenY - rat.offsetTop;
        angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // Adjusted by 90 degrees
        rat.style.transform = `rotate(${angle}deg)`;

        setTimeout(() => {
            rat.style.left = `${offscreenX}px`;
            rat.style.top = `${offscreenY}px`;

            setTimeout(() => {
                const reappearPosition = getRandomPosition();
                const dx = reappearPosition.x - offscreenX;
                const dy = reappearPosition.y - offscreenY;
                angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // Adjusted by 90 degrees

                rat.style.transition = 'none';
                rat.style.transform = `rotate(${angle}deg)`;
                rat.style.left = `${reappearPosition.x}px`;
                rat.style.top = `${reappearPosition.y}px`;

                setTimeout(() => {
                    rat.style.transition = 'transform 0.5s, left 1s linear, top 1s linear';
                    moveRat(); // Resume normal skittering
                }, 50); // Small delay to apply the new position
            }, hideDuration); // Wait before reappearing
        }, 1000); // Ensure the rat has moved offscreen before starting the timer
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
