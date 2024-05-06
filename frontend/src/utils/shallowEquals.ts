export function shallowEquals<T extends Object>(a: T, b: T) {
  for (let key in a) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}
