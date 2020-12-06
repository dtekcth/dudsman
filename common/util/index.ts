export const join = (names: string[]) =>
  names.length <= 1 ? names[0] ?? '' : names.slice(0, -1).join(', ') + ' and ' + names.slice(-1);
