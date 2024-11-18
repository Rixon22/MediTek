import axios from "axios";

export const retrieveSession = () => {
    try {
        const user = JSON.parse(sessionStorage.getItem('userData'));
        axios.defaults.headers.common.Authorization = user.token;
        return user;
    } catch (error) {
        console.error(error);
    }
}