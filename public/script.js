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
        speed: 8
    };

    // Show the first question
    questions[currentQuestion].style.display = 'block';

    document.querySelectorAll('.answer').forEach(button => {
        button.addEventListener('click', event => {
            const soundSrc1 = event.target.getAttribute('data-sound1');
            const soundSrc2 = event.target.getAttribute('data-sound2');
            const soundSrc3 = event.target.getAttribute('data-sound3');

            if (soundSrc1) soundsData.push(soundSrc1);
            if (soundSrc2) soundsData.push(soundSrc2);
            if (soundSrc3) soundsData.push(soundSrc3);

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

    // Square properties
    let squareX = Math.random() * (canvas.width - squareProperties.size); // Random starting x position
    let squareY = Math.random() * (canvas.height - squareProperties.size); // Random starting y position
    let dx = squareProperties.speed * 0.67; // Horizontal speed
    let dy = squareProperties.speed * 0.67; // Vertical speed

    // Color change interval
    const colorChangeInterval = 12; // Change the color every 12 frames to slow down the animation
    let frameCount = 0;

    // Array to store previous positions and colors for trail effect
    const trailPositions = [];
    const trailColors = [];

    // Function to draw a square on the canvas
    function drawSquare(x, y, size, color) {
        ctx.fillStyle = color; // Set fill color
        ctx.fillRect(x, y, size, size); // Draw filled rectangle
    }

    // Function to play a sound with slight pitch variation
    function playSound(src) {
        const sound = new Audio(src);
        const playbackRate = 1 + (Math.random() * 0.1 - 0.05); // Vary the playback rate slightly
        sound.playbackRate = playbackRate;
        sound.play();
    }

    // Function to animate the square
    function animate() {
        if (!isRunning) return; // Check if animation is paused

        frameCount++; // Increment frame count

        // Change color and play sound every colorChangeInterval frames
        if (frameCount % colorChangeInterval === 0) {
            // Generate a random color for the square
            const hueVariation = Math.random() * 20 - 10; // Slight variation of +/- 10
            const newHue = (squareProperties.color.hue + hueVariation) % 360;
            squareProperties.color.hue = newHue;
            const color = `hsl(${newHue}, 100%, 50%)`;

            // Add current position and color to arrays for trail effect
            trailPositions.push({ x: squareX, y: squareY });
            trailColors.push(color);

            // Play corresponding sound if there is any
            const soundIndex = Math.floor((frameCount / colorChangeInterval) % soundsData.length);
            if (soundsData[soundIndex]) {
                playSound(soundsData[soundIndex]);
            }
        }

        // Move the square diagonally
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

        // Draw trail
        for (let i = 0; i < trailPositions.length; i++) {
            const { x, y } = trailPositions[i]; // Get position from array
            const color = trailColors[i]; // Get color from array
            drawSquare(x, y, squareProperties.size, color); // Draw square at position with color
        }

        // Request next animation frame to continue animation loop
        requestAnimationFrame(animate);
    }
});
