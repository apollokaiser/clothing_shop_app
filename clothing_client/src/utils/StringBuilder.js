export class StringBuilder {
    static isEmpty(str) {
        if(!str) return true;
        return str.trim() === '';
    }
    static isNotEmpty(str) {
        return !StringBuilder.isEmpty(str);
    }
    static isNumber(number) {
        if(!number) return false;
        return !isNaN(number);
    }
}