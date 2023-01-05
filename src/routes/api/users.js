import express from 'express';
import { users } from '../../middleware/validator';
import { createUsers, deleteUsers, getDetailUsers, getListUsers, updateUsers, updateUsersPassword } from '../../controllers/api/users';
import { isSuper } from '../../middleware/guards';

const router = express.Router();

router.get('/', getListUsers);
router.post('/create', users.createUserValidation(), createUsers);
router.put('/edit/:id', users.updateUserValidation(), updateUsers);
router.get('/detail/:id', getDetailUsers);
router.delete('/delete/:id', deleteUsers);
router.put('/edit/password/:id', users.updateUserPasswordValidation(), updateUsersPassword);

module.exports = router;