let globalUserId: string | null = null;

export const setGlobalUserId = (userId: string | null) => {
  globalUserId = userId;
};

export const getGlobalUserId = () => {
  return globalUserId;
};
