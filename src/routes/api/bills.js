import express from 'express';
import { isSuper } from '../../middleware/guards';
import { getDetailBills, getListBills } from '../../controllers/api/bills';

const router = express.Router();

router.get('/', getListBills);
router.get('/detail/:id', getDetailBills);

module.exports = router;