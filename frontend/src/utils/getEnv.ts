export const getEnv = () => {
  const host = window.location.hostname;
  if (host.indexOf('localhost') > -1 || host.indexOf('127.0.0.1') > -1) {
    return 'development';
  }
  if (host.indexOf('staging') > -1) {
    return 'staging';
  }
  if (host.indexOf('rc') > -1) {
    return 'rc';
  }
  return 'production';
};
