const sanitizeFilename = (filename) => {
    var invalidChars = /[\/\?<>\\:\*\|":]/g; // regex to find invalid characters
    var controlChars = /[\x00-\x1f\x80-\x9f]/g; // regex to find control characters
    var reservedWords = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];

    filename = filename
        .replace(invalidChars, '')
        .replace(controlChars, '')
        .replace('.', '_'); // replace dots inside filename

    filename = filename.split(' ').join('_'); // replace whitespace with underscore

    // Check if filename is reserved word
    if (reservedWords.indexOf(filename.toUpperCase()) !== -1) {
        filename = filename + '_';
    }

    return filename;
}

export default sanitizeFilename;
