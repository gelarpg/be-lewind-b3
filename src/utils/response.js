/**
 * @param {number} code
 * @param {string} message
 * @param {*} data
 * @returns {}
 */
export const responseSuccess = (code, message = 'Success', data) => {
    let result = {
        meta: {
            code: code,
            success: true,
            message: message
        }
    }

    if (data) {
        result['data'] = data;
    }

    return result;
}

/**
 * @param code - number
 * @param error - string
 * @return {}
 */
export const responseError = (code, error) => {
    let result = {
        meta: {
            code: code,
            success: false,
            message: error.message || error
        }
    }

    return result;
}