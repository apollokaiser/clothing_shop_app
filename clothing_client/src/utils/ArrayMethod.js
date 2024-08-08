export function compare(a, b) {
    if(!a ||!b) return false;
   let result = a.length === b.length &&
  a.every((element, index) => element === b[index]);
  if(result) return true;
}
export function isInclude(a, b) {
    if(!a ||!b) return false;
    return a.every(element => b.includes(element));
}