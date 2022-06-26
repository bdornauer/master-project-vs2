const grammar = ["mike", "top", "down", "left", "right", "in", "out", "turn", "light", "density", "increase", "decrease", "invert", "change", "clockwise", "counterclockwise", "counter-clockwise", "default"];

export function stringTranscriptToLowerCase(transcript) {
    return transcript.toLowerCase();
}

export function transcriptToWordArray(transcript) {
    return transcript.split(' ');
}

/**
 * Filters all words, which are commands
 * @param arrayTranscript
 * @returns {*}
 */
export function filterCommands(arrayTranscript) {
    return arrayTranscript.filter(function (value) {
        return grammar.includes(value)
    });
}

export function containsSignalWord(array) {
    return array.includes("mike")
}

/**
 * Counts all words after signal "Mike"
 * @param arrayTranscript
 * @returns {number}
 */
export function countWordsAfterSignalWord(arrayTranscript) {
    let indexSignalWord = arrayTranscript.indexOf("mike");
    if (indexSignalWord === -1) {
        return -1;
    } else {
        return arrayTranscript.length - indexSignalWord;
    }

}

/**
 * Extracts the first number 1 - 10 in an array
 * @param arrayTranscript
 * @returns {number|*}
 */
export function extractFirstNumberInStringArray(arrayTranscript) {
    let mySteps = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

    let arrayWithOnlyNumbers = arrayTranscript.filter(function (element) {
        return mySteps.includes(element)
    });
    console.log("Zahl: " + arrayWithOnlyNumbers[0]);
    if (arrayWithOnlyNumbers.length > 0) return arrayWithOnlyNumbers[0]; else return 1
}

/**
 * Each voice command is equivalent to a specific control command e.g. saturation decrease -> saturationDown
 * @param command
 * @returns {string}
 */
export function setCommandFromVoiceCommand(command) {
    switch (command) {
        case 'in':
            return ("zoomIn");
        case 'out':
            return ("zoomOut");
        case 'left':
            return ("goLeft");
        case 'top':
            return ("goUp");
        case 'down':
            return ("goDown");
        case 'right':
            return ("goRight");
        case 'light decrease':
            return ("brightnessDown");
        case 'light increase':
            return ("brightnessUp");
        case 'density decrease':
            return ("saturationDown");
        case 'density increase':
            return ("saturationUp");
        case 'turn clockwise':
            return ("turnRight");
        case 'turn counterclockwise':
            return ("turnLeft");
        case 'turn counter-clockwise':
            return ("turnLeft");
        case 'default':
            return ("default");
        case 'change':
            return ("invert");
        default:
            return ("");
    }
}