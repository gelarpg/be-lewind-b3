import express from 'express';
import { isSuper } from '../../middleware/guards';
import { getDetailBills, getListBills, updatePaymentStatus } from '../../controllers/api/bills';

const router = express.Router();

router.get('/', getListBills);
router.get('/detail/:id', getDetailBills);
router.put('/edit/payment-status/:id', updatePaymentStatus);

module.exports = router;