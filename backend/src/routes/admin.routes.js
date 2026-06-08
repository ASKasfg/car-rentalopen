const express = require('express');
const router = express.Router();
const { addVehicle, updateVehicle, deleteVehicle, getAllBookings, getStatistics } = require('../controllers/admin.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.use(authMiddleware, adminMiddleware);

router.post('/vehicles', addVehicle);
router.put('/vehicles/:id', updateVehicle);
router.delete('/vehicles/:id', deleteVehicle);
router.get('/bookings', getAllBookings);
router.get('/statistics', getStatistics);

module.exports = router;