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
                createInitialSquares(); // Create initial squares based on user's choice
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

    // Array to store square objects
    const squares = [];

    // Function to generate a random color
    function randomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    // Function to create initial squares based on user's choice
    function createInitialSquares() {
        const tiredness = squareProperties.tiredness || 1; // Default to 1 if not specified
        const numSquares = Math.floor(tiredness) + Math.random(); // Generate a random number of squares
        for (let i = 0; i < numSquares; i++) {
            const square = {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                color: squareProperties.color === 'random' ? randomColor() : squareProperties.color
            };
            squares.push(square);
        }
    }

    // Function to draw a square on the canvas
    function drawSquare(square) {
        ctx.fillStyle = square.color; // Set fill color
        ctx.fillRect(square.x, square.y, squareProperties.size, squareProperties.size); // Draw filled rectangle
    }

    // Function to animate the squares
    function animate() {
        if (!isRunning) return; // Check if animation is paused

        // Clear canvas before drawing the next frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw squares
        squares.forEach(drawSquare);

        // Request next animation frame to continue animation loop
        requestAnimationFrame(animate);
    }
});
