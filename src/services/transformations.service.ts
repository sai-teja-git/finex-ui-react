const titleCase = (str: string) => {
    try {
        return str.toLowerCase().split(' ').map((word) => (word.charAt(0).toUpperCase() + word.slice(1))).join(' ');
    } catch { }
    return str
}

const transformationService = {
    titleCase
}

export default transformationService