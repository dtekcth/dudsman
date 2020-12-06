import React from 'react';

// Calls the specified callback after delay.
// Cancels all timers on unmount
export default function useTimeout() {
  const timerRefs = React.useRef<NodeJS.Timer[]>([]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => timerRefs.current.forEach((id) => clearTimeout(id));
  }, []);

  const func = React.useCallback((cb: () => void, delay = 0) => {
    const timer = setTimeout(cb, delay);
    timerRefs.current.push(timer);
    return timer;
  }, []);

  return func;
}
