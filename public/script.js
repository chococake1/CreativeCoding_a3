document.addEventListener('DOMContentLoaded', () => {
    const questions = document.querySelectorAll('.question');
    const playSymphonyButton = document.getElementById('playSymphony');
    const stopSymphonyButton = document.getElementById('stopSymphony');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let currentQuestion = 0;
    let isRunning = false; // Boolean variable to control animation
    let chosenSounds = []; // Array to store chosen sounds
    let chosenColors = []; // Array to store chosen colors

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
            // Add the chosen sounds to the array
            chosenSounds.push([
                event.target.getAttribute('data-sound1'),
                event.target.getAttribute('data-sound2'),
                event.target.getAttribute('data-sound3')
            ]);

            // Add the chosen color to the array
            const color = event.target.getAttribute('data-value');
            if (color) {
                chosenColors.push(color);
            }

            // Update square properties based on user's choice
            const property = event.target.getAttribute('data-property');
            const value = event.target.getAttribute('data-value');
            if (property && value) {
                if (property === 'size' || property === 'speed') {
                    squareProperties[property] = parseFloat(value);
                } else if (property === 'color') {
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
    const colorChangeInterval = 60; // Change the color every 60 frames
    let frameCount = 0;

    // Function to play a random sound from the chosen sounds
    function playRandomSound() {
        if (chosenSounds.length > 0) {
            const randomIndex = Math.floor(Math.random() * 3); // Random index between 0 and 2
            const sound = new Audio(chosenSounds[Math.floor(Math.random() * chosenSounds.length)][randomIndex]);
            sound.play();
        }
    }

    // Function to change the background color slowly
    function changeBackgroundColor() {
        const gradientColors = chosenColors.map(color => `${color} 25%`).join(', ');
        document.body.style.background = `linear-gradient(270deg, ${gradientColors})`;
        document.body.style.backgroundSize = '400% 400%';
        document.body.style.animation = 'gradient 15s ease infinite';
    }

    // Keyframes for gradient animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(style);

    // Function to animate the square
    function animate() {
        if (!isRunning) return; // Check if animation is paused

        frameCount++; // Increment frame count

        // Play a random sound every colorChangeInterval frames
        if (frameCount % colorChangeInterval === 0) {
            playRandomSound();
        }

        // Update square position
        squareX += dx;
        squareY += dy;

        // Check for collision with canvas edges and bounce back
        if (squareX + squareProperties.size > canvas.width || squareX < 0) {
            dx = -dx;
        }
        if (squareY + squareProperties.size > canvas.height || squareY < 0) {
            dy = -dy;
        }

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the square with current properties
        ctx.fillStyle = squareProperties.color;
        ctx.fillRect(squareX, squareY, squareProperties.size, squareProperties.size);

        // Change the background color slowly
        changeBackgroundColor();

        // Request next animation frame to continue animation loop
        requestAnimationFrame(animate);
    }
});
