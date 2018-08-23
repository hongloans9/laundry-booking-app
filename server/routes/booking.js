import express from 'express';
import validate from 'express-validateion';
import * as controller from '../controllers/booking';

const router = express.Router();
router.route('/').get(controller.getBookings)
    .post(controller.createBooking);

router.route('/:id').delete(controller.deleteBooking);

router.route('/availableTime').get(controller.getAvailableTime);

module.exports = router;