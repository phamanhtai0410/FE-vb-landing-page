import { alertConstants } from '../constants';

export const alertActions = {
    loading,
    update,
    warning,
    success,
    error,
    clear
};

function loading(message, key) {
    // console.log("duration", duration);
    return { type: alertConstants.LOADING, message, key };
}
function update(message, key, status) {
    return { type: alertConstants.UPDATE, message, key, status };
}
function success(message, key) {
    return { type: alertConstants.SUCCESS, message, key };
}

function warning(message, key) {
    return { type: alertConstants.WARNING, message, key };
}
function error(message, key) {
    return { type: alertConstants.ERROR, message, key };
}

function clear(key) {
    return { type: alertConstants.CLEAR, key };
}