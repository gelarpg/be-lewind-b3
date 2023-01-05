import express from 'express';
import { clients } from '../../middleware/validator';
import { isSuper } from '../../middleware/guards';
import { createClients, deleteClients, getDetailClients, getListClients, updateClients } from '../../controllers/api/clients';

const router = express.Router();

router.get('/', getListClients);
router.get('/detail/:id', getDetailClients);
router.post('/create', clients.createClientsValidation(), createClients);
router.put('/edit/:id', clients.updateClientsValidation(), updateClients);
router.delete('/delete/:id', deleteClients);

module.exports = router;