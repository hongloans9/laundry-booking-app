import express from 'express';
import * as controller from '../controllers/authentication';

const router = express.Router();
router.route('/').post(controller.authenticate);

module.exports = router;