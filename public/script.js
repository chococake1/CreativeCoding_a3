document.addEventListener('DOMContentLoaded', () => {
    const sounds = [];
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
            const sound = new Audio(event.target.getAttribute('data-sound'));
            sounds.push(sound);

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

        // Change color and play sound every colorChangeInterval frames
        if (frameCount % colorChangeInterval === 0) {
            // Generate a random color for the square
            const color = squareProperties.color === 'random' ? randomColor() : squareProperties.color;

            // Add current position and color to arrays for trail effect
            trailPositions.push({ x: squareX, y: squareY });
            trailColors.push(color);

            // Play corresponding sound if there is any
            const soundIndex = (frameCount / colorChangeInterval) % sounds.length;
            if (sounds[soundIndex]) {
                sounds[soundIndex].currentTime = 0; // Reset sound to start
                sounds[soundIndex].play();
            }
        }

        // Move the square
        squareX += dx; // Move horizontally
        squareY += dy; // Move vertically

        // Bounce off the edges if the square hits the canvas boundaries
        if (squareX + squareProperties.size > canvas.width || squareX <
