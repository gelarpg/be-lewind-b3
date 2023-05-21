import express from 'express';
import { getListDailyCount, getListGeneratedInvoice } from '../../controllers/api/daily_count';
import { generateInvoice } from '../../controllers/api/daily_count';

const router = express.Router();

router.get('/', getListDailyCount);
router.post('/generate-invoice', generateInvoice);
router.get('/list-invoice', getListGeneratedInvoice);

module.exports = router;