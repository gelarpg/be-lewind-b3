import express from 'express';
import { isSuper } from '../../middleware/guards';
import { getDashbaords } from '../../controllers/api/dashboard';

const router = express.Router();

router.get('/', getDashbaords);
module.exports = router;