document.addEventListener('DOMContentLoaded', () => {
    const sounds = [];
    const playSymphonyButton = document.getElementById('playSymphony');
    const stopSymphonyButton = document.getElementById('stopSymphony');

    document.querySelectorAll('.answer').forEach(button => {
        button.addEventListener('click', event => {
            const sound = new Audio(event.target.getAttribute('data-sound'));
            sounds.push(sound);
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
