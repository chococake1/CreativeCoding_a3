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
                // All questions answered, start animation
                initializeSquare(); // Moved inside else block
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

    function initializeSquare() {
        // Set canvas width and height to fill the window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Start animation loop
        isRunning = true;
        animate();
    }

    // Function to draw a square on the canvas
    function drawSquare(x, y, size, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);
    }

    function animate() {
        if (!isRunning) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw square
        const hueVariation = Math.random() * 20 - 10;
        const newHue = (squareProperties.color.hue + hueVariation) % 360;
        squareProperties.color.hue = newHue;
        const color = `hsl(${newHue}, 100%, 50%)`;

        drawSquare(
            Math.random() * (canvas.width - squareProperties.size),
            Math.random() * (canvas.height - squareProperties.size),
            squareProperties.size,
            color
        );

        // Request next animation frame
        requestAnimationFrame(animate);
    }
});
