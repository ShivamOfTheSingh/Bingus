/**
 * Reads from a file to convert it into a base64 string
 * 
 * @param {File} file The file to read 
 * @param {Function} cb A callback function that does something to the base64 string after successfully converting
 */
export default function readFile(file: File, cb: (base64String: string) => void) {
    const reader = new FileReader();
    reader.onloadend = function () {
        const base64String = reader.result as string;
        cb(base64String);
    };
    reader.readAsDataURL(file);
}