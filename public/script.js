<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Symphony with Squares</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        #canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            display: none; /* Hide the canvas initially */
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Create Your Symphony</h1>
        <div id="questions">
            <div class="question">
                <p>1. Choose a mood:</p>
                <button class="answer" data-sound1="sound1.mp3" data-sound2="sound2.mp3" data-sound3="sound3.mp3" data-property="color" data-value="red">Happy</button>
                <button class="answer" data-sound1="sound4.mp3" data-sound2="sound5.mp3" data-sound3="sound6.mp3" data-property="color" data-value="blue">Sad</button>
                <button class="answer" data-sound1="sound7.mp3" data-sound2="sound8.mp3" data-sound3="sound9.mp3" data-property="color" data-value="green">Excited</button>
            </div>
            <div class="question">
                <p>2. How tired are you?</p>
                <button class="answer" data-sound1="sound10.mp3" data-sound2="sound11.mp3" data-sound3="sound12.mp3" data-property="squareCount" data-value="1">Not tired</button>
                <button class="answer" data-sound1="sound13.mp3" data-sound2="sound14.mp3" data-sound3="sound15.mp3" data-property="squareCount" data-value="2">A bit tired</button>
                <button class="answer" data-sound1="sound16.mp3" data-sound2="sound17.mp3" data-sound3="sound18.mp3" data-property="squareCount" data-value="3">Very tired</button>
            </div>
        </div>
        <div id="controls" style="display: none;">
            <button id="playSymphony">Play Symphony</button>
            <button id="stopSymphony">Stop Symphony</button>
        </div>
    </div>

    <canvas id="canvas"></canvas>
    
    <script src="script.js"></script>
</body>
</html>
