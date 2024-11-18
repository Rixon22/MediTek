export const retrieveSession = () => {
    try {
        const user = JSON.parse(sessionStorage.getItem('userData'));
        return user;
    } catch (error) {
        console.error(error);
    }
}