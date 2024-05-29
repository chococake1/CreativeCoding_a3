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
        size: 240,
        speed: 4 // Slower speed
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
                createSquares(parseInt(value)); // Create squares based on user's answers
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

    // Array to store squares
    const squares = [];

    // Function to create a square
    function createSquare() {
        return {
            x: Math.random() * (canvas.width - squareProperties.size),
            y: Math.random() * (canvas.height - squareProperties.size),
            dx: squareProperties.speed * (Math.random() * 2 - 1), // Random horizontal velocity
            dy: squareProperties.speed * (Math.random() * 2 - 1), // Random vertical velocity
        };
    }

    // Function to draw a square on the canvas
    function drawSquare(square) {
        ctx.fillStyle = squareProperties.color.baseColor; // Set fill color
        ctx.fillRect(square.x, square.y, squareProperties.size, squareProperties.size); // Draw filled rectangle
    }

    // Function to animate the squares
    function animate() {
        if (!isRunning) return; // Check if animation is paused

        // Clear canvas before drawing the next frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw each square and update its position
        squares.forEach(square => {
            // Draw square
            drawSquare(square);

            // Move the square
            square.x += square.dx; // Move horizontally
            square.y += square.dy; // Move vertically

            // Bounce off the edges if the square hits the canvas boundaries
            if (square.x + squareProperties.size > canvas.width || square.x < 0) {
                square.dx = -square.dx; // Reverse horizontal direction
            }
            if (square.y + squareProperties.size > canvas.height || square.y < 0) {
                square.dy = -square.dy; // Reverse vertical direction
            }
        });

        // Request next animation frame to continue animation loop
        requestAnimationFrame(animate);
    }

    // Create squares based on user's answers
    function createSquares(numSquares) {
        squares.length = 0; // Clear existing squares
        for (let i = 0; i < numSquares; i++) {
            squares.push(createSquare());
        }
    }
});
