document.addEventListener('DOMContentLoaded', () => {
    const rat = document.getElementById('rat');
    const moveInterval = 2000; // Time in milliseconds between movements
    const pauseTime = 500; // Time in milliseconds to stand still before turning and moving again
    const hideDuration = 3000; // Time in milliseconds to hide after click
    const animationDuration = 1000; // Time in milliseconds for animation
    const clickCooldown = 2000; // Time in milliseconds to prevent rapid clicking
    let angle = 0;
    let timeoutID;
    let canClick = true;

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
        if (!canClick) return; // Ignore clicks during cooldown
        canClick = false; // Disable click event temporarily

        clearTimeout(timeoutID); // Clear the ongoing movement timeout

        // Get current rat position
        const currentX = rat.offsetLeft;
        const currentY = rat.offsetTop;

        // Determine offscreen position
        const offscreenX = Math.random() > 0.5 ? -rat.clientWidth : window.innerWidth;
        const offscreenY = Math.random() > 0.5 ? -rat.clientHeight : window.innerHeight;

        // Calculate angle for animation
        const dx = offscreenX - currentX;
        const dy = offscreenY - currentY;
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
