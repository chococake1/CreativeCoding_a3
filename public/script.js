<script>
    document.addEventListener('DOMContentLoaded', () => {
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

        // Function to generate a random color
        function randomColor() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        }

        // Function to draw a square on the canvas
        function drawSquare(x, y, size, color) {
            ctx.fillStyle = color; // Set fill color
            ctx.fillRect(x, y, size, size); // Draw filled rectangle
        }

        // Function to play a random sound associated with the button
        function playRandomSound(button) {
            const soundIndex = Math.floor(Math.random() * 3) + 1; // Generate a random index between 1 and 3
            const soundSrc = button.getAttribute(`data-sound${soundIndex}`);
            const sound = new Audio(soundSrc);
            sound.play();
        }

        // Function to animate the square
        function animate() {
            if (!isRunning) return; // Check if animation is paused

            frameCount++; // Increment frame count

            // Play a random sound every colorChangeInterval frames
            if (frameCount % colorChangeInterval === 0) {
                // Play a random sound associated with the chosen option
                const currentQuestionButtons = questions[currentQuestion - 1].querySelectorAll('.answer');
                currentQuestionButtons.forEach(button => {
                    playRandomSound(button);
                });
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

            // Draw the square
            drawSquare(squareX, squareY, squareProperties.size, squareProperties.color);

            // Request next animation frame to continue animation loop
            requestAnimationFrame(animate);
        }
    });
</script>
