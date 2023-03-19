import express from 'express';
import { isSuper } from '../../middleware/guards';
import { getDetailOrder, getListOrders } from '../../controllers/api/orders';

const router = express.Router();

router.get('/', getListOrders);
router.get('/detail/:id', getDetailOrder);

module.exports = router;