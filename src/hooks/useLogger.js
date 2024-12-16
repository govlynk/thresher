export function useLogger(componentName) {
  const debug = (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${componentName}]`, ...args);
    }
  };

  const error = (...args) => {
    console.error(`[${componentName}]`, ...args);
  };

  const warn = (...args) => {
    console.warn(`[${componentName}]`, ...args);
  };

  const info = (...args) => {
    console.info(`[${componentName}]`, ...args);
  };

  return {
    debug,
    error,
    warn,
    info,
  };
}