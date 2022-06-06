/**
 * Returns to the key a specific command
 * @param pressedKey the key which was pressed
 * @returns {string} the specific command
 */
export function keySelectionCommand(pressedKey) {
    switch (pressedKey) {
        case 'i':
            return ("zoomIn");
        case 'o':
            return ("zoomOut");
        case 'ArrowLeft':
            return ("goLeft");
        case 'ArrowUp':
            return ("goUp");
        case 'ArrowDown':
            return ("goDown");
        case 'ArrowRight':
            return ("goRight");
        case 'a':
            return ("turnLeft");
        case 'd':
            return ("turnRight");
        case 'w':
            return ("brightnessUp");
        case 's':
            return ("brightnessDown");
        case 'n':
            return ("saturationDown");
        case 'm':
            return ("saturationUp");
        case 'v':
            return ("invert");
        case 'c':
            return ("default");
        default:
            return ("");
    }
}

/**
 * This function suppresses the standard navigation inside the website (scroll down, go left ...)
 */
export function supressKey() {
    window.addEventListener("keydown", function (e) {
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);
}


