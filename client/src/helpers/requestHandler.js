import axios from 'axios'

const postRequest = async (url, data) => {
    try {
        const response = await axios.post(url, data);
        return response;
    } catch (error) {
        return new Promise((resolve) => {
            resolve({ error: error })
        })
    }
}

const getRequest = async (url, params = null) => {
    try {
        const response = await axios.get(url, { params });
        return response;
    } catch (error) {
        return new Promise((resolve) => {
            resolve({ error: error });
        });
    }
};

const putRequest = async (url, data) => {
    try {
        const response = await axios.put(url, data);
        return response;
    } catch (error) {
        return new Promise((resolve) => {
            resolve({ error: error })
        })
    }
}

const deleteRequest = async (url, params = null) => {
    try {
        const response = await axios.delete(url, { params });
        return response;
    } catch (error) {
        return new Promise((resolve) => {
            resolve({ error: error })
        })
    }
}


export { postRequest, getRequest, putRequest, deleteRequest };