import axios from 'axios'

const postRequest = async (url, data) => {
    try {
        const response = await axios.post(url, data);
        return response;
    } catch (error) {
        return { error: error }
    }
}

const getRequest = (params) => {
    console.log(params)
}

export { postRequest, getRequest };