const grammar = ["mike", "go", "up", "down", "left", "right", "invert"];

export function transcriptToLowerCase(transcript) {
    return transcript.toLowerCase();
}

export function transcriptToArray(transcript) {
    return transcript.split(' ');
}

export function filterCommands(arrayTranscript) {
    return arrayTranscript.filter(function (value) {
        return grammar.includes(value)
    });
}

export function containsSignalWord(array) {
    return array.includes("mike")
}

export function getLast5Words(arrayTranscript) {
    return (arrayTranscript.slice(0, 5))
}

export function countWordsAfterSignalWord(arrayTranscript) {
    let indexSignalWord = arrayTranscript.indexOf("mike");
    if (indexSignalWord === -1) {
        return -1;
    } else {
        return arrayTranscript.length - indexSignalWord;
    }

}

export function getCommandToVoiceCommand(command) {

    switch (command) {
        case 'zoom in':
            return ("zoomIn");
        case 'zoom out':
            return ("zoomOut");
        case 'go left':
            return ("goLeft");
        case 'go up':
            return ("goUp");
        case 'go down':
            return ("goDown");
        case 'go right':
            return ("goRight");
        case 'brightness down':
            return ("brightnessDown");
        case 'brightness up':
            return ("brightnessUp");
        case 'saturation down':
            return ("saturationDown");
        case 'saturation up':
            return ("saturationUp");
        case 'invert':
            return ("invert");
        case 'default':
            return ("default");
        default:
            return ("");
    }
}