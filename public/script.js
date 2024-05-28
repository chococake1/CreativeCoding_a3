document.addEventListener('DOMContentLoaded', () => {
    const sounds = [];
    const questions = document.querySelectorAll('.question');
    const playSymphonyButton = document.getElementById('playSymphony');
    const stopSymphonyButton = document.getElementById('stopSymphony');
    let currentQuestion = 0;

    // Show the first question
    questions[currentQuestion].style.display = 'block';

    document.querySelectorAll('.answer').forEach(button => {
        button.addEventListener('click', event => {
            const sound = new Audio(event.target.getAttribute('data-sound'));
            sounds.push(sound);

            // Hide the current question
            questions[currentQuestion].style.display = 'none';

            // Show the next question if available
            currentQuestion++;
            if (currentQuestion < questions.length) {
                questions[currentQuestion].style.display = 'block';
            } else {
                document.getElementById('controls').style.display = 'block';
            }
        });
    });

    playSymphonyButton.addEventListener('click', () => {
        sounds.forEach(sound => sound.play());
    });

    stopSymphonyButton.addEventListener('click', () => {
        sounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    });
});
