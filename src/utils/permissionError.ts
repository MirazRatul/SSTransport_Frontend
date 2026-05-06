export const isPermissionError = (error: any) => {
  const status = error?.response?.status;
  return status === 401 || status === 403;
};
