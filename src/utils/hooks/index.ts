import React from 'react';

export { default as useTimeout } from './useTimeout';

export function useNextFrame<T>(value: T) {
  const [state, setState] = React.useState<T>();

  React.useEffect(() => setState(value), [value]);

  return state;
}
