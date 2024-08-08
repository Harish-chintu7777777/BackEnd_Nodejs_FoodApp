const vendorController = require('../Controllers/VendorController');


const express = require('express');

const router = express.Router();
console.log(vendorController);
router.post('/register', vendorController.vendorRegister);
router.post('/login', vendorController.vendorLogin);

router.get('/all-vendors', vendorController.getAllVendors)
router.get('/single-vendor/:id', vendorController.getVendorById)
module.exports = router;
