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
        color: { baseColor: 'hsl(0, 100%, 50%)', hue: 0 },
        size: 50, // Smaller square size
        speed: 1 // Slower speed
    };

    // Show the first question
    questions[currentQuestion].style.display = 'block';

    document.querySelectorAll('.answer').forEach(button => {
        button.addEventListener('click', event => {
            const soundSrc1 = event.target.getAttribute('data-sound1');
            const soundSrc2 = event.target.getAttribute('data-sound2');
            const soundSrc3 = event.target.getAttribute('data-sound3');
            soundsData.push([soundSrc1, soundSrc2, soundSrc3]);

            // Update square properties based on user's choice
            const property = event.target.getAttribute('data-property');
            const value = event.target.getAttribute('data-value');
            if (property && value) {
                if (property === 'size' || property === 'speed') {
                    squareProperties[property] = parseFloat(value);
                } else if (property === 'color') {
                    squareProperties.color.baseColor = value;
                } else if (property === 'squareCount') {
                    // Generate random squares based on tiredness level
                    generateRandomSquares(parseInt(value));
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

    // Array to store the random squares
    let squares = [];

    // Function to generate random squares
    function generateRandomSquares(count) {
        squares = [];
        for (let i = 0; i < count; i++) {
            const size = Math.floor(Math.random() * 50) + 20; // Random size between 20 and 70
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const dx = Math.random() * 2 - 1; // Random horizontal speed between -1 and 1
            const dy = Math.random() * 2 - 1; // Random vertical speed between -1 and 1
            const color = { hue: Math.random() * 360 }; // Random hue
            squares.push({ x, y, size, dx, dy, color });
        }
    }

    // Function to animate the square
    function animate() {
        if (!isRunning) return; // Check if animation is paused

        // Clear canvas before drawing the next frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw and update each square
        squares.forEach(square => {
            // Generate a random color for the square
            const hueVariation = Math.random() * 20 - 10; // Slight variation of +/- 10
            const newHue = (square.color.hue + hueVariation) % 360;
            square.color.hue = newHue;
            square.color.value = '100%';
            square.color.lightness = '50%';
            const color = `hsl(${newHue}, 100%, 50%)`;

            // Draw the square and its trail
            drawSquare(square);
            drawTrail(square);

            // Move the square
            square.x += square.dx; // Move horizontally
            square.y += square.dy; // Move vertically

            // Bounce off the edges if the square hits the canvas boundaries
            if (square.x + square.size > canvas.width || square.x < 0) {
                square.dx = -square.dx; // Reverse horizontal direction
            }
            if (square.y + square.size > canvas.height || square.y < 0) {
                square.dy = -square.dy; // Reverse vertical direction
            }
        });

        // Request next animation frame to continue animation loop
        requestAnimationFrame(animate);
    }

    // Function to draw the square on the canvas
    function drawSquare(square) {
        ctx.fillStyle = squareProperties.color.baseColor; // Set fill color
        ctx.fillRect(square.x, square.y, square.size, square.size); // Draw filled rectangle
    }

// Function to draw the trail of the square
function drawTrail(square) {
    const trailColor = `hsla(${square.color.hue}, 100%, 50%, 0.1)`; // Semi-transparent trail color
    ctx.fillStyle = trailColor; // Set trail fill color
    const trailSize = square.size * 1.5; // Increase trail size for better visibility
    ctx.fillRect(square.x - trailSize / 2, square.y - trailSize / 2, square.size + trailSize, square.size + trailSize); // Draw filled rectangle for trail
}

});
