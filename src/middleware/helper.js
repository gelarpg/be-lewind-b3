import fs from 'fs';
import { getManager } from 'typeorm';

const createRecord = async (Model, dataRecord) => {
    try {
        let db = getManager();

        await db.createQueryBuilder()
            .insert()
            .into(Model)
            .values(dataRecord)
            .execute();

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}


export const checkAndCreateDirectory = (dir) => {
    let arrayPath = dir.split('/');
    let pathToCreate = ".";
    for (let index = 0; index < arrayPath.length; index++) {
        if (arrayPath[index] !== '' && arrayPath[index] !== '.') {
            pathToCreate = pathToCreate + '/' + arrayPath[index];
            if (!fs.existsSync(pathToCreate)) {
                fs.mkdirSync(pathToCreate);
            }
        }
    }
}

// export const moveAttachment = async (attachments, dirAttachment, investigationId, type) => {
//     try {
//         checkAndCreateDirectory(dirAttachment);
//         let dirToDB = dirAttachment.split('/');
//         let isValid = true
//         // FIRST UNSET "." from dir
//         dirToDB.splice(0, 1);
//         // SECOND UNSET "public" from dir
//         dirToDB.splice(0, 1);
//         dirToDB = '/' + dirToDB.join('/');

//         if (attachments.constructor == Array) {
//             for (let index = 0; index < attachments.length; index++) {
//                 if (attachments[index].indexOf('/') < 0 && fs.existsSync('./tmp/' + attachments[index]) && isValid) {
//                     fs.renameSync('./tmp/' + attachments[index], dirAttachment + '/' + attachments[index].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));
//                     await createRecord(InvestigationAttachment, {
//                         investigation_id: investigationId,
//                         name: attachments[index].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'),
//                         type: type,
//                         path: dirToDB + '/' + attachments[index].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'),
//                         created_at: new Date(),
//                         updated_at: new Date()
//                     })
//                 }
//                 if (index + 1 >= attachments.length) {
//                     return true;
//                 }
//             }
//         } else {
//             if (attachments.indexOf('/') < 0 && fs.existsSync('./tmp/' + attachments) && isValid) {
//                 fs.renameSync('./tmp/' + attachments, dirAttachment + '/' + attachments.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));

//                 await createRecord(InvestigationAttachment, {
//                     investigation_id: investigationId,
//                     name: attachments.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'),
//                     type: type,
//                     path: dirToDB + '/' + attachments.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'),
//                     created_at: new Date(),
//                     updated_at: new Date()
//                 });
//             }
//             return true;
//         }
//     } catch (error) {
//         console.log(error)
//         return false;
//     }
// }

// const mappingAttachment = (oldData, attachments = []) => {
//     let result = [];
//     let resultFile = [];
//     return new Promise((resolve, reject) => {
//         if (typeof oldData !== 'undefined' && typeof oldData.attachment !== 'undefined') {
//             if (oldData.attachment.constructor == Array) {
//                 for (let index = 0; index < oldData.attachment.length; index++) {
//                     if (oldData.attachment[index].indexOf('/') < 0) {
//                         result.push([oldData.attachment[index]]);
//                     }
//                 }
//             } else {
//                 if (oldData.attachment.indexOf('/') < 0) {
//                     result.push(oldData.attachment);
//                 }
//             }
//         }
//         result = result.concat(attachments);
//         if (result.length > 0) {
//             for (let index = 0; index < result.length; index++) {
//                 let isFromDB = typeof result[index].file !== 'undefined';
//                 resultFile.push({
//                     fileDir: ((isFromDB) ? result[index].file : ((result[index].constructor == Array) ? result[index][0] : result[index])),
//                     id: ((isFromDB) ? String(result[index]._id) : ''),
//                     isFromDB: isFromDB
//                 })
//                 if (index + 1 >= result.length) {
//                     resolve(resultFile);
//                 }
//             }
//         } else {
//             resolve([]);
//         }
//     }).then((data) => {
//         return data;
//     })
// }


// module.exports = {
//     moveAttachment,
//     mappingAttachment
// }