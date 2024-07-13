import authHeader from '../_helpers/Auth.header';
import BasePath from '../_helpers/BasePath';

export const CommonService = {
    login,
    register,

    save,
    update,
    getAll,
    getById,
    delete: _delete
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

async function save(controlerName, isFile, model) {
    // debugger;
    const requestOptions = createRequestOptions('POST', model, isFile);
    const response = await fetch(BasePath.BASE_API_PATH + `${controlerName}/Save/`, requestOptions);
    return handleResponse(response);
}

async function update(controlerName, isFile, model) {
    const requestOptions = createRequestOptions('POST', model, isFile);
    const response = await fetch(`${BasePath.BASE_API_PATH}${controlerName}/update/`, requestOptions);
    return handleResponse(response);
}

async function getAll(controlerName, isFile) {
    const requestOptions = createRequestOptions('GET', null, isFile);
    const response = await fetch(`${BasePath.BASE_API_PATH}${controlerName}/GetAll`, requestOptions);
    return handleResponse(response)
}

async function getById(controlerName,isFile,id){
    const requestOptions = createRequestOptions('GET',null,isFile);
    const response = await fetch(`${BasePath.BASE_API_PATH}${controlerName}/GetById/${id}`,requestOptions);
    return handleResponse(response);
}

async function _delete(controlerName,isFile,model){
    const requestOptions = createRequestOptions('POST',model,isFile);
    const response = await fetch(`${BasePath.BASE_API_PATH}${controlerName}/Delete/`,requestOptions);
    return handleResponse(response);
}

function createRequestOptions(method, body, isFile = false) {
    const headers = {
        'Content-type': 'application/json',
        ...authHeader(isFile)
    };

    const requestOptions = {
        method,
        headers
    };
    if (body) {
        requestOptions.body = JSON.stringify(body);
    }
    return requestOptions;
}

async function handleResponse(response) {
    const text = await response.text();
    const data = text && JSON.parse(text);

    if (!response.ok) {
        if (response.status === 401) {
            console.log(response);
        }
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }
    return data;
}