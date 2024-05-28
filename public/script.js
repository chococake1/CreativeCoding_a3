document.addEventListener('DOMContentLoaded', () => {
    const sounds = [];
    const questions = document.querySelectorAll('.question');
    const playSymphonyButton = document.getElementById('playSymphony');
    const stopSymphonyButton = document.getElementById('stopSymphony');
    const canvas = document.getElementById('canvas');
    let currentQuestion = 0;
    let isRunning = false; // Boolean variable to control animation

    // Show the first question
    questions[currentQuestion].style.display = 'block';

    document.querySelectorAll('.answer').forEach(button => {
        button.addEventListener('click', event => {
            const sound = new Audio(event.target.getAttribute('data-sound'));
            sounds.push(sound);

            // Hide the current question
            questions[currentQuestion].style.display = 'none';

            // Show the next question if available
            currentQuestion++;
            if (currentQuestion < questions.length) {
                questions[currentQuestion].style.display = 'block';
            } else {
                document.getElementById('controls').style.display = 'block';
                canvas.style.display = 'block'; // Show the canvas
                isRunning = true; // Start square animation
                animate(); // Start animation loop
            }
        });
    });

    playSymphonyButton.addEventListener('click', () => {
        sounds.forEach(sound => sound.play());
        isRunning = true; // Resume square animation
        animate(); // Continue animation loop
    });

    stopSymphonyButton.addEventListener('click', () => {
        sounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        isRunning = false; // Pause square animation
    });

    // Square animation code
    const ctx = canvas.getContext('2d');

    // Set canvas width and height to fill the window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Square properties
    let squareSize = 240; // Squares are 240 pixels big
    let squareX = Math.random() * (canvas.width - squareSize); // Random starting x position
    let squareY = Math.random() * (canvas.height - squareSize); // Random starting y position
    let dx = 8; // 4 times faster
    let dy = 8; // 4 times faster

    // Color change interval
    const colorChangeInterval = 4; // Colour changes every 4 frames
    let frameCount = 0;

    // Array to store previous positions and colors for trail effect
    const trailPositions = [];
    const trailColors = [];

    // Function to generate a random color
    function randomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    // Function to draw a square on the canvas
    function drawSquare(x, y, size, color) {
        ctx.fillStyle = color; // Set fill color
        ctx.fillRect(x, y, size, size); // Draw filled rectangle
    }

    // Function to animate the square
    function animate() {
        if (!isRunning) return; // Check if animation is paused

        frameCount++; // Increment frame count

        // Change color every colorChangeInterval frames
        if (frameCount % colorChangeInterval === 0) {
            // Generate a random color for the square
            const color = randomColor();

            // Add current position and color to arrays for trail effect
            trailPositions.push({ x: squareX, y: squareY });
            trailColors.push(color);
        }

        // Move the square
        squareX += dx; // Move horizontally
        squareY += dy; // Move vertically

        // Bounce off the edges if the square hits the canvas boundaries
        if (squareX + squareSize > canvas.width || squareX < 0) {
            dx = -dx; // Reverse horizontal direction
        }
        if (squareY + squareSize > canvas.height || squareY < 0) {
            dy = -dy; // Reverse vertical direction
        }

        // Clear canvas before drawing the next frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw trail
        for (let i = 0; i < trailPositions.length; i++) {
            const { x, y } = trailPositions[i]; // Get position from array
            const color = trailColors[i]; // Get color from array
            drawSquare(x, y, squareSize, color); // Draw square at position with color
        }

        // Request next animation frame to continue animation loop
        requestAnimationFrame(animate);
    }
});
