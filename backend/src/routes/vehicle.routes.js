const express = require('express');
const router = express.Router();
const { getAllVehicles, searchAvailableVehicles, getVehicleById } = require('../controllers/vehicle.controller');

router.get('/', getAllVehicles);
router.get('/search', searchAvailableVehicles);
router.get('/:id', getVehicleById);

module.exports = router;