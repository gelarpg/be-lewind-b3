const { responseError, responseSuccess } = require("../../utils/response");

exports.uploadFile = async (req, res) => {
    // RESPONSE
    let response = {}
    let statusCode = 500;

    try {
        if (!req.files) {
            statusCode = 400;
            throw new Error("File tidak boleh kosong")
        }

        let fileName = [];
        for (const item of req.files) {
            fileName.push(item.filename);
        }

        response = responseSuccess(200, "Success!", fileName);
        res.status(200).send(response);
        res.end();
    } catch (error) {
        if (statusCode != 500) {
            response = responseError(statusCode, error);
        } else {
            console.log('ERROR: ', error);
            response = responseError(500, 'Terjadi kesalahan pada server.')
        }
        res.status(response.meta.code).send(response);
        res.end();
    }
}