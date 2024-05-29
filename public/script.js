document.addEventListener('DOMContentLoaded', () => {
    const soundsData = [];
    const questions = document.querySelectorAll('.question');
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

    // Function to update background color
    function updateBackgroundColor(color) {
        document.body.style.backgroundColor = color;
    }

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
                    if (value === 'blue') {
                        // Set base color to blue if "Sad" button is clicked
                        squareProperties.color.baseColor = 'blue';
                        squareProperties.color.hue = 240; // Hue 240 for blue
                    } else if (value === 'yellow') {
                        // Set base color to yellow if "Excited" button is clicked
                        squareProperties.color.baseColor = 'yellow';
                        squareProperties.color.hue = 60; // Hue 60 for yellow
                    } else {
                        // For other colors, set base color and hue to defaults
                        squareProperties.color.baseColor = value;
                        squareProperties.color.hue = 0;
                    }
                } else if (property === 'squares') {
                    if (value === "1") {
                        squareProperties.size *= 0.65;
                        squareProperties.speed = 3;
                    } else if (value === "2") {
                        squareProperties.size *= 0.8;
                        squareProperties.speed = 2.2;
                    } else if (value === "3") {
                        // For "Not tired at all", increase speed by 50%
                        squareProperties.speed = 1;
                    }
                }
            }

            // Hide the current question
            questions[currentQuestion].style.display = 'none';

            // Show the next question if available
            currentQuestion++;
            if (currentQuestion < questions.length) {
                questions[currentQuestion].style.display = 'block';
            } else {
                // Fade in the background color
                if (squareProperties.color.baseColor) {
                    updateBackgroundColor(squareProperties.color.baseColor);
                }

                canvas.style.display = 'block'; // Show the canvas
                isRunning = true; // Start square animation
                animate(); // Start animation loop
            }
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

    // Ensure initial diagonal movement direction
    if (Math.random() > 0.5) dx = -dx; // Randomly start in one diagonal direction
    if (Math.random() > 0.5) dy = -dy; // Randomly start in one diagonal direction

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

let lastPlayedSoundIndex = -1; // Initialize with an invalid index

// Function to play a random sound from soundsData
function playRandomSound() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * soundsData.length);
    } while (randomIndex === lastPlayedSoundIndex); // Ensure the new random index is different from the last played index

// Function to play sounds 13, 14, or 15 every 3 seconds if the user chooses "Not Bad"
function playNotBadSound() {
    const notBadButtons = document.querySelectorAll('.answer[data-value="240"]');
    notBadButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Check if the clicked button has value "240" (Not Bad)
            if (button.getAttribute('data-value') === "240") {
                // Set interval to play sounds 13, 14, or 15 every 3 seconds
                setInterval(() => {
                    const randomSoundIndex = Math.floor(Math.random() * 3) + 13; // Random index between 13 and 15
                    playSound(`sound${randomSoundIndex}.mp3`);
                }, 3000);
            }
        });
    });
}
        lastPlayedSoundIndex = randomIndex; // Update the last played sound index
    }
}

// Use setInterval to play a random sound every 1 second
setInterval(playRandomSound, 400);
    
    // Function to animate the square
    function animate() {
        if (!isRunning) return; // Check if animation is paused

        frameCount++; // Increment frame count

        // Change color and play sound every colorChangeInterval frames
        if (frameCount % (colorChangeInterval * 2) === 0) {
            // Generate a random color for the square
            const hueVariation = Math.random() * 20 - 10; // Slight variation of +/- 10
            const newHue = (squareProperties.color.hue + hueVariation) % 360;
            squareProperties.color.hue = newHue;
            const color = `hsl(${newHue}, 100%, 50%)`;

            // Add current position and color to arrays for trail effect
            trailPositions.push({ x: squareX, y: squareY });
            trailColors.push(color);

            // // Play a random sound from the soundsData array
            // if (soundsData.length > 0) {
            //     const randomIndex = Math.floor(Math.random() * soundsData.length);
            //     playSound(soundsData[randomIndex]);
            // }
        }

        // Move the square diagonally
        const speedFactor = Math.sqrt(squareProperties.speed * squareProperties.speed / 2); // Adjust speed for diagonal movement
        squareX += dx * speedFactor; // Move horizontally
        squareY += dy * speedFactor; // Move vertically

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
