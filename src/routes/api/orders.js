import express from 'express';
import { isSuper } from '../../middleware/guards';
import { submission } from '../../middleware/validator';
import { getDetailOrder, getListOrders, updateOrderStatus } from '../../controllers/api/orders';

const router = express.Router();

router.get('/', getListOrders);
router.get('/detail/:id', getDetailOrder);
router.put('/edit/status/:id', submission.updateSubmissionStatusValidation(), updateOrderStatus);

module.exports = router;