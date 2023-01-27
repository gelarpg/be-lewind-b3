import express from 'express';
import { getUserProfile } from '../../controllers/api/authentication';

const router = express.Router();

router.get('/profile', getUserProfile);

module.exports = router;