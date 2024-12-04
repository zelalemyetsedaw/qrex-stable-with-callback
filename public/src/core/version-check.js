/**
 * Check if QR Code version is valid
 *
 * @param  {Number}  version QR Code version
 * @return {Boolean}         true if valid version, false otherwise
 */
export function isValid(version) {
    return !isNaN(Number(version)) && Number(version) >= 1 && Number(version) <= 40;
}
