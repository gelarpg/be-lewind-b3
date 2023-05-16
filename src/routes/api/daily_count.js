import express from 'express';
import { isSuper } from '../../middleware/guards';
import { submission } from '../../middleware/validator';
import { getListDailyCount } from '../../controllers/api/daily_count';

const router = express.Router();

router.get('/', getListDailyCount);
// router.get('/detail/:id', getDetailOrder);
// router.put('/edit/status/:id', submission.updateSubmissionStatusValidation(), updateOrderStatus);
// router.put('/edit/:id', updateOrders);

module.exports = router;