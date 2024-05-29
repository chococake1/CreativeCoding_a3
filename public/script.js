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
        size: 40,
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

        // Draw and update squares
        squares.forEach(square => {
            // Draw square
            drawSquare(square);

            // Update square position
            square.x += square.dx;
            square.y += square.dy;

            // Check if square is within canvas bounds
            if (square.x < 0 || square.x > canvas.width || square.y < 0 || square.y > canvas.height) {
                // Reset square position if it goes out of bounds
                square.x = Math.random() * canvas.width;
                square.y = Math.random() * canvas.height;
            }
        });

        // Request next animation frame to continue animation loop
        requestAnimationFrame(animate);
    }

    // Function to generate a random color with slight variation from the base color
    function generateRandomColor(baseColor) {
        const hueVariation = Math.random() * 20 - 10; // Slight variation of +/- 10
        const newHue = (baseColor.hue + hueVariation) % 360;
        baseColor.hue = newHue;
        return `hsl(${newHue}, 100%, 50%)`;
    }

    // Create initial squares
    for (let i = 0; i < 10; i++) { // Adjust the number of squares as needed
        const square = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            dx: squareProperties.speed * (Math.random() - 0.5),
            dy: squareProperties.speed * (Math.random() - 0.5),
            color: generateRandomColor(squareProperties.color)
        };
        squares.push(square);
    }
});
