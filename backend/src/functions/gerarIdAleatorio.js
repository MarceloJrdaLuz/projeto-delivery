export default function getRndInteger(min, max) {
    const aleatorio = Math.floor(Math.random() * (max - min + 1)) + min
    return aleatorio
}
 