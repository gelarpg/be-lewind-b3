import { validationResult } from 'express-validator';
import url from 'url';
import * as auth from './auth';
import * as users from './users';
import * as driver from './driver';
import * as transportation from './transportation';
import * as waste from './waste';
import * as clients from './clients';
import * as submission from './submission';

const validate = validationResult.withDefaults({
    formatter: error => {
        return {
            param: error.param,
            msg: error.msg
        }
    }
})

module.exports = {
    validate,
    auth,
    users,
    driver,
    transportation,
    waste,
    clients,
    submission
}