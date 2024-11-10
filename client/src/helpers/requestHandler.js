import axios from 'axios'

async function postRequest(url, data) {
    try {
        const response = await axios.post(url, data);
        return response;
    } catch (error) {
        return { error: error }
    }
}

async function getRequest(params) {
    console.log(params)
}

export default { postRequest, getRequest };