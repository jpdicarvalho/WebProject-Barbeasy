export const setAuthToken = (token) => {
    localStorage.setItem('token', token);
};

export const getAuthToken = () => {
    return localStorage.getItem('token');
};