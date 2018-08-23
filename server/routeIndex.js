import express from 'express';
import bookingRoute from './routes/booking';
import authRoute from './routes/authentication';

const router = express.Router();

router.get('/status', (req, res) =>
    res.send('OK')
);

router.use('/booking', bookingRoute);
router.use('/auth', authRoute);

module.exports = router;