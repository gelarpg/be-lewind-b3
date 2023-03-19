import express from 'express';
import { submission } from '../../middleware/validator';
import { isSuper } from '../../middleware/guards';
import { approvalSubmission, createSubmission, deleteSubmission, getDetailSubmission, getListSubmission, getListSubmissionStatus, updateSubmission } from '../../controllers/api/submission';

const router = express.Router();

router.get('/list/status', getListSubmissionStatus);
router.get('/', getListSubmission);
router.get('/detail/:id', getDetailSubmission);
router.post('/create', submission.createSubmissionValidation(), createSubmission);
router.put('/edit/:id', submission.updateSubmissionValidation(), updateSubmission);
router.put('/approval/:id', approvalSubmission);
router.delete('/delete/:id', deleteSubmission);

module.exports = router;