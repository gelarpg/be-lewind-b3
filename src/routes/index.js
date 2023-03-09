import express from 'express';
import apiRouter from './api';

const router = express.Router();

router.use('/b3/api', apiRouter);

module.exports = router;
