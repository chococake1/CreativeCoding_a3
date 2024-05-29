document.addEventListener('DOMContentLoaded', () => {
    const soundsData = [];
    const questions = document.querySelectorAll('.question');
    const playSymphonyButton = document.getElementById('playSymphony');
    const stopSymphonyButton = document.getElementById('stopSymphony');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let currentQuestion = 0;
    let isRunning = false; // Boolean variable to control animation

    // Default square properties
    let squareProperties = {
        color: 'black',
        size: 240,
        speed: 8
    };

    // Show the first question
    questions[currentQuestion].style.display = 'block';

    document.querySelectorAll('.answer').forEach(button => {
        button.addEventListener('click', event => {
            const soundSrc = event.target.getAttribute('data-sound');
            soundsData.push(soundSrc);

            // Update square properties based on user's choice
            const property = event.target.getAttribute('data-property');
            const value = event.target.getAttribute('data-value');
            if (property && value) {
                if (property === 'size' || property === 'speed') {
                    squareProperties[property] = parseFloat(value);
                } else {
                    squareProperties[property] = value;
                }
            }

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
        isRunning = true; // Resume square animation
        animate(); // Continue animation loop
    });

    stopSymphonyButton.addEventListener('click', () => {
        isRunning = false; // Pause square animation
        // Stop all sounds
        const sounds = document.querySelectorAll('audio');
        sounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    });

    // Set canvas width and height to fill the window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Square properties
    let squareX = Math.random() * (canvas.width - squareProperties.size); // Random starting x position
    let squareY = Math.random() * (canvas.height - squareProperties.size); // Random starting y position
    let dx = squareProperties.speed * 0.67; // Slow down by about 1/3
    let dy = squareProperties.speed * 0.67; // Slow down by about 1/3

    // Color change interval
    const colorChangeInterval = 12; // Change the color every 12 frames to slow down the animation
    let frameCount = 0;

    // Array to store previous positions and colors for trail effect
    const trailSquares = [];

    // Function to draw a square on the canvas
    function drawSquare(square) {
        ctx.fillStyle = square.color; // Set fill color
        ctx.fillRect(square.x, square.y, squareProperties.size, squareProperties.size); // Draw filled rectangle
    }

    // Function to play a sound
    function playSound(src) {
        const sound = new Audio(src);
        sound.play();
    }

    // Function to animate the square
    function animate() {
        if (!isRunning) return; // Check if animation is paused

        frameCount++; // Increment frame count

        // Change color and play sound every colorChangeInterval frames
        if (frameCount % colorChangeInterval === 0) {
            // Generate a random color for the square
            const color = squareProperties.color === 'random' ? randomColor() : squareProperties.color;

            // Create a new square object with current position and color
            const square = {
                x: squareX,
                y: squareY,
                color: color
            };

            // Add current square to the trail array
            trailSquares.push(square);

            // Play corresponding sound if there is any
            const soundIndex = (frameCount / colorChangeInterval) % soundsData.length;
            if (soundsData[soundIndex]) {
                playSound(soundsData[soundIndex]);
            }
        }

        // Move the square
        squareX += dx; // Move horizontally
        squareY += dy; // Move vertically

        // Bounce off the edges if the square hits the canvas boundaries
        if (squareX + squareProperties.size > canvas.width || squareX < 0) {
            dx = -dx; // Reverse horizontal direction
        }
        if (squareY + squareProperties.size > canvas.height || squareY < 0) {
            dy = -dy; // Reverse vertical direction
        }

        // Clear canvas before drawing the next frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw trail squares
        trailSquares.forEach(drawSquare);

        // Request next animation frame to continue animation loop
        requestAnimationFrame(animate);
    }
});
