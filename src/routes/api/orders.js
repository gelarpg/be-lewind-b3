import express from 'express';
import { isSuper } from '../../middleware/guards';
import { submission } from '../../middleware/validator';
import { getDetailOrder, getListOrders, updateOrders, updateOrderStatus } from '../../controllers/api/orders';

const router = express.Router();

router.get('/', getListOrders);
router.get('/detail/:id', getDetailOrder);
router.put('/edit/status/:id', submission.updateSubmissionStatusValidation(), updateOrderStatus);
router.put('/edit/:id', updateOrders);

module.exports = router;