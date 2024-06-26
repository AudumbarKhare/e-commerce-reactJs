import BasePath from '../../_helpers/BasePath';

export const userService = {
    login,
    register
};

async function login(username, password) {
    const requestOptions = createRequestOptions('POST', { username, password });
    const response = await fetch(`${BasePath.BASE_API_PATH}UserMaster/Login/`, requestOptions);
    return handleResponse(response);
}

async function register(model) {
    const requestOptions = createRequestOptions('POST', model);
    const response = await fetch(`${BasePath.BASE_API_PATH}UserMaster/Save/`, requestOptions);
    return handleResponse(response);
}

function createRequestOptions(method, body) {
    return {
        method,
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(body)
    };
}

async function handleResponse(response){
    const text = await response.text();
    const data = text && JSON.parse(text);

    if(!response.ok){
        if(response.status === 401){
            console.log(response);
        }
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }
    return data;
}