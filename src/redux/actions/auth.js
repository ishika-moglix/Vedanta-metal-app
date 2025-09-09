export const setLogin = func => {
  return {
    type: 'SET_LOGIN',
    payload: {
      setIsLoggedIn: func,
    },
  };
};
