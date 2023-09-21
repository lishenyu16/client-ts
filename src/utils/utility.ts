export const throttle = function (func: Function, delay: number) {
  let prev = 0;
  return () => {
    let args = arguments;
    let now = Date.now();
    if (now - prev >= delay) {
      func(...args);
      prev = Date.now();
    }
  }
}