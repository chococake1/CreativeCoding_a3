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

            timeoutID = setTimeout(moveRat, moveInterval); // Move again after
