const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getUserHistory, cancelBooking } = require('../controllers/booking.controller');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', createBooking);
router.get('/', getUserBookings);
router.get('/history', getUserHistory);
router.put('/:id/cancel', cancelBooking);

module.exports = router;