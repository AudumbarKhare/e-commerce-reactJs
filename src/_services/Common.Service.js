import authHeader from '../_helpers/Auth.header';
import BasePath from '../_helpers/BasePath';

export const CommonService = {
    login,
    register,
    save,
    update,
    getAll,
    getProductPicturebyId,
    getById,
    delete: _delete
};

// Login function
async function login(username, password) {
    const requestOptions = createRequestOptions('POST', { username, password });
    const response = await fetch(`${BasePath.BASE_API_PATH}UserMaster/Login/`, requestOptions);
    return handleResponse(response);
}

// Register function
async function register(model) {
    const requestOptions = createRequestOptions('POST', model);
    const response = await fetch(`${BasePath.BASE_API_PATH}UserMaster/Save/`, requestOptions);
    return handleResponse(response);
}

// Save function
async function save(controlerName, isFile, model) {
    const requestOptions = createRequestOptions('POST', model, isFile);
    const response = await fetch(`${BasePath.BASE_API_PATH}${controlerName}/Save/`, requestOptions);
    return handleResponse(response);
}

// Update function
async function update(controlerName, isFile, model) {
    const requestOptions = createRequestOptions('POST', model, isFile);
    const response = await fetch(`${BasePath.BASE_API_PATH}${controlerName}/Update/`, requestOptions);
    return handleResponse(response);
}

// Get all function
async function getAll(controlerName, isFile) {
    const requestOptions = createRequestOptions('GET', null, isFile);
    const response = await fetch(`${BasePath.BASE_API_PATH}${controlerName}/GetAll`, requestOptions);
    return handleResponse(response);
}

// Get by ID function
async function getById(controlerName, isFile, id) {
    const requestOptions = createRequestOptions('GET', null, isFile);
    const response = await fetch(`${BasePath.BASE_API_PATH}${controlerName}/GetById/${id}`, requestOptions);
    return handleResponse(response);
}

// Delete function
async function _delete(controlerName, isFile, model) {
    const requestOptions = createRequestOptions('POST', model, isFile);
    const response = await fetch(`${BasePath.BASE_API_PATH}${controlerName}/Delete/`, requestOptions);
    return handleResponse(response);
}

// Get Images
async function getProductPicturebyId(controlerName, isFile, id) {
    const requestOptions = createRequestOptions('GET', null, isFile);
    const response = await fetch(BasePath.BASE_API_PATH + `${controlerName}/GetProductPicturebyId/${id}`, requestOptions);
    return handleResponse(response);
}

// Helper function to create request options
function createRequestOptions(method, body, isFile = false) {
    const headers = {
        // 'Content-Type': isFile ? 'multipart/form-data' : 'application/json',
        ...authHeader(isFile)
    };

    const requestOptions = {
        method,
        headers
    };

    if (body) {
        requestOptions.body = isFile ? body : JSON.stringify(body);
    }

    return requestOptions;
}

// Handle the response
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
