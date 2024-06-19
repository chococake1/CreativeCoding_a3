document.addEventListener('DOMContentLoaded', () => {
    const rat = document.getElementById('rat');
    const catSound = document.getElementById('cat-sound');
    const mouseSound = document.getElementById('mouse-sound');
    const moveInterval = 2000; // Time in milliseconds between movements
    const pauseTime = 500; // Time in milliseconds to stand still before turning and moving again
    const hideDuration = 3000; // Time in milliseconds to hide after click
    const animationDuration = 1000; // Time in milliseconds for animation
    const minMoveDistance = Math.min(window.innerWidth, window.innerHeight) / 5; // Minimum distance to move
    let angle = 0;
    let timeoutID;
    let canClick = true;
    let runCount = 0;

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

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
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

    function flashBackgroundColor() {
        const originalColor = 'white';
        const randomColor = getRandomColor();
        document.body.style.transition = 'background-color 0s'; // Disable transition for instant change
        document.body.style.backgroundColor = randomColor;
        setTimeout(() => {
            document.body.style.transition = 'background-color 2s'; // Enable transition for smooth return
            document.body.style.backgroundColor = originalColor;
        }, 50); // Hold the color for a short time before transitioning back to white
    }

    function runAway(event) {
        if (!canClick) return; // Ignore clicks during cooldown
        canClick = false; // Disable click event temporarily

        clearTimeout(timeoutID); // Clear the ongoing movement timeout

        // Play the cat sound
        catSound.play().catch(error => console.error("Failed to play sound:", error));

        // Stop the rat suddenly
        rat.style.transition = 'none';

        // Calculate the angle to face the direction of the click
        const dx = event.clientX - rat.offsetLeft;
        const dy = event.clientY - rat.offsetTop;
        angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // Adjusted by 90 degrees

        // Turn the rat to face the direction of the click
        rat.style.transform = `rotate(${angle}deg)`;

        // Flash the background color
        flashBackgroundColor();

        // Determine offscreen position
        const offscreenX = Math.random() > 0.5 ? -rat.clientWidth : window.innerWidth;
        const offscreenY = Math.random() > 0.5 ? -rat.clientHeight : window.innerHeight;

        // Calculate angle for animation
        const dxOffscreen = offscreenX - rat.offsetLeft;
        const dyOffscreen = offscreenY - rat.offsetTop;
        angle = Math.atan2(dyOffscreen, dxOffscreen) * (180 / Math.PI) + 90; // Adjusted by 90 degrees

        // Smoothly move rat offscreen
        rat.style.transition = `transform ${animationDuration / 1000}s, left ${animationDuration / 1000}s linear, top ${animationDuration / 1000}s linear`;
        rat.style.transform = `rotate(${angle}deg)`;
        rat.style.left = `${offscreenX}px`;
        rat.style.top = `${offscreenY}px`;

        // Wait for hide duration
        setTimeout(() => {
            // Calculate a new angle for the rat to return onscreen smoothly
            const reappearPosition = getRandomPosition();
            const dxReturn = reappearPosition.x - offscreenX;
            const dyReturn = reappearPosition.y - offscreenY;
            angle = Math.atan2(dyReturn, dxReturn) * (180 / Math.PI) + 90; // Adjusted by 90 degrees

            // Move rat back onscreen
            rat.style.transition = 'none';
            rat.style.left = `${offscreenX}px`;
            rat.style.top = `${offscreenY}px`;
            rat.style.transform = `rotate(${angle}deg)`;

            setTimeout(() => {
                rat.style.transition = `left ${animationDuration / 1000}s linear, top ${animationDuration / 1000}s linear, transform ${animationDuration / 1000}s`;
                rat.style.left = `${reappearPosition.x}px`;
                rat.style.top = `${reappearPosition.y}px`;

                // Continue moving the rat after it reappears
                setTimeout(() => {
                    canClick = true;
                    timeoutID = setTimeout(moveRat, moveInterval);
                }, animationDuration);

            }, 50); // Give time for the transition setup
        }, hideDuration);

        runCount++;
        if (runCount >= 2 && Math.random() < 0.5) {
            mouseSound.play().catch(error => console.error("Failed to play mouse sound:", error));
            runCount = 0;
        }
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
