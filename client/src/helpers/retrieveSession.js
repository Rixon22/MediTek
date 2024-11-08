export const retrieveSession = () => {
    try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        return user;
    } catch (error) {
        console.error(error);
    }
}