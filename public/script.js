document.addEventListener('DOMContentLoaded', () => {
    const rat = document.getElementById('rat');
    const moveInterval = 2000; // Time in milliseconds between movements
    const pauseTime = 500; // Time in milliseconds to stand still before turning and moving again
    const hideDuration = 3000; // Time in milliseconds to hide after click
    const animationDuration = 1000; // Time in milliseconds for animation
    const clickCooldown = 2000; // Time in milliseconds to prevent rapid clicking
    const minMoveDistance = Math.min(window.innerWidth, window.innerHeight) / 5; // Minimum distance to move
    let angle = 0;
    let timeoutID;
    let canClick = true;

    function getRandomPosition() {
        let newPosition;
        do {
            newPosition = {
                x: Math.random() * (window.innerWidth - rat.clientWidth),
                y: Math.random() * (window.innerHeight - rat.clientHeight)
            };
        } while (Math.abs(newPosition.x - rat.offsetLeft) < minMoveDistance || Math.abs(newPosition.y - rat.offsetTop) < minMoveDistance);
        return newPosition;
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

    function runAway(event) {
        if (!canClick) return; // Ignore clicks during cooldown
        canClick = false; // Disable click event temporarily

        clearTimeout(timeoutID); // Clear the ongoing movement timeout

        // Stop the rat suddenly
        rat.style.transition = 'none';

        // Calculate the angle to face the direction of the click
        const dx = event.clientX - rat.offsetLeft;
        const dy = event.clientY - rat.offsetTop;
        angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // Adjusted by 90 degrees

        // Turn the rat to face the direction of the click
        rat.style.transform = `rotate(${angle}deg)`;

        // Wait a short time for the rat to turn
        setTimeout(() => {
            // Determine offscreen position
            const offscreenX = Math.random() > 0.5 ? -rat.clientWidth : window.innerWidth;
            const offscreenY = Math.random() > 0.5 ? -rat.clientHeight : window.innerHeight;

            // Calculate angle for animation
            const dx = offscreenX - rat.offsetLeft;
            const dy = offscreenY - rat.offsetTop;
            angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // Adjusted by 90 degrees

            // Smoothly move rat offscreen
            rat.style.transition = `transform ${animationDuration / 1000}s, left ${animationDuration / 1000}s linear, top ${animationDuration / 1000}s linear`;
            rat.style.transform = `rotate(${angle}deg)`;
            rat.style.left = `${offscreenX}px`;
            rat.style.top = `${offscreenY}px`;

            // Wait for hide duration
            setTimeout(() => {
                // Get random onscreen position
                const reappearPosition = getRandomPosition();

                // Calculate angle for animation
                const dx = reappearPosition.x - offscreenX;
                const dy = reappearPosition.y - offscreenY;
                angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // Adjusted by 90 degrees

                // Smoothly move rat back onscreen
                rat.style.transition = `transform ${animationDuration / 1000}s, left ${animationDuration / 1000}s linear, top ${animationDuration / 1000}s linear`;
                rat.style.transform = `rotate(${angle}deg)`;
                rat.style.left = `${reappearPosition.x}px`;
                rat.style.top = `${reappearPosition.y}px`;

                // Re-enable click event after cooldown
                setTimeout(() => {
                    canClick = true;
                }, clickCooldown);

                // Continue moving the rat
                timeoutID = setTimeout(moveRat, moveInterval);
            }, hideDuration);
        }, 50); // Wait 50 milliseconds for the rat to turn
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
