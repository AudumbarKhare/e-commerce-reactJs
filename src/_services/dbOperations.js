// services/crudService.js
import { CommonService } from './Common.Service';
import { toast } from 'react-toastify';

const handleResponse = async (promise, successMessage, failureMessage, isShow) => {
    try {
        const res = await promise;
        if (res.isSuccess) {
            if (isShow) toast.success(successMessage);
            return res.data;
        } else {
            toast.error(res.errors[0]);
            return null;
        }
    } catch (error) {
        toast.error(failureMessage);
        return null;
    }
};

export const crudService = {
    performCrudOperation: async (operation, isImage = false, endpoint, data = null, id = 0) => {
        let promise;
        let successMessage = '';
        let failureMessage = '';
        let isShow = false;  // Initialize isShow

        switch (operation) {
            case 'create':
                promise = CommonService.save(endpoint, isImage, data);
                successMessage = 'Data has been saved successfully!';
                failureMessage = 'Failed to save data!';
                isShow = true;  // Set isShow to true
                break;

            case 'update':
                promise = CommonService.update(endpoint, isImage, data);
                successMessage = 'Data has been updated successfully!';
                failureMessage = 'Failed to update data!';
                isShow = true;  // Set isShow to true
                break;

            case 'delete':
                promise = CommonService.delete(endpoint, isImage, { id });
                successMessage = 'Data has been deleted successfully!';
                failureMessage = 'Failed to delete data!';
                isShow = true;  // Set isShow to true
                break;

            case 'fetchAll':
                promise = CommonService.getAll(endpoint, false);
                successMessage = 'Data fetched successfully!';
                failureMessage = 'Failed to fetch data!';
                isShow = false;  // Set isShow to false (no toast needed)
                break;

            default:
                throw new Error(`Unknown operation: ${operation}`);
        }

        return handleResponse(promise, successMessage, failureMessage, isShow);
    }
};
