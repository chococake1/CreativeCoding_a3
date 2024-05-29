Skip to content
Navigation Menu
chococake1
/
HearYourself

Type / to search

Code
Issues
Pull requests
Actions
Projects
Wiki
Security
Insights
Settings
Commit
Update script.js
 main
@chococake1
chococake1 committed 5 minutes ago 
1 parent 3998000
commit 3c92eb1
Showing 1 changed file with 6 additions and 10 deletions.
  16 changes: 6 additions & 10 deletions16  
public/script.js
@@ -42,17 +42,14 @@ document.addEventListener('DOMContentLoaded', () => {
                        // Set base color to blue if "Sad" button is clicked
                        squareProperties.color.baseColor = 'blue';
                        squareProperties.color.hue = 240; // Hue 240 for blue
                        updateBackgroundColor('blue'); // Update background color to blue
                    } else if (value === 'yellow') {
                        // Set base color to yellow if "Excited" button is clicked
                        squareProperties.color.baseColor = 'yellow';
                        squareProperties.color.hue = 60; // Hue 60 for yellow
                        updateBackgroundColor('yellow'); // Update background color to yellow
                    } else {
                        // For other colors, set base color and hue to defaults
                        squareProperties.color.baseColor = value;
                        squareProperties.color.hue = 0;
                        updateBackgroundColor(value); // Update background color to the selected color
                    }
                }
            }
@@ -65,16 +62,15 @@ document.addEventListener('DOMContentLoaded', () => {
            if (currentQuestion < questions.length) {
                questions[currentQuestion].style.display = 'block';
            } else {
                // Start animation and show canvas after the third question is answered
                // Fade in the background color
                if (squareProperties.color.baseColor) {
                    updateBackgroundColor(squareProperties.color.baseColor);
                }

                canvas.style.display = 'block'; // Show the canvas
                isRunning = true; // Start square animation
                animate(); // Start animation loop
            }

            // Check if "Sad" button was clicked and set the initial color to blue
            if (value === 'blue') {
                squareProperties.color.baseColor = 'blue';
            }
        });
    });

@@ -144,7 +140,7 @@ document.addEventListener('DOMContentLoaded', () => {
        squareY += dy; // Move vertically

        // Bounce off the edges if the square hits the canvas boundaries
        if (squareX + squareProperties.size > canvas.width || squareX < 0) {
if (squareX + squareProperties.size > canvas.width || squareX < 0) {
            dx = -dx; // Reverse horizontal direction
        }
        if (squareY + squareProperties.size > canvas.height || squareY < 0) {
0 comments on commit 3c92eb1
@chococake1
Comment
 
Leave a comment
 
Footer
© 2024 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact
Manage cookies
Do not share my personal information
History for public/script.js - chococake1/HearYourself
