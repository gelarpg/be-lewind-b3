import express from 'express';
import { getListActivityLog } from '../../controllers/api/activity_log';

const router = express.Router();

router.get('/', getListActivityLog);

module.exports = router;