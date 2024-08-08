const dotenv = require('dotenv');
dotenv.config();
const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Vendor registration handler
const vendorRegister = async (req, res) => {
    console.log(req.body);
    const { username, email, password } = req.body;

    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json({ message: "Email already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });

        await newVendor.save();
        res.status(201).json({ message: "Vendor registered successfully" });
        console.log('Registered');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Vendor login handler
const vendorLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login attempt with email:', email);

        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            console.log('Vendor not found');
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, vendor.password);
        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ success: "Login successful", token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all vendors handler
const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');
        res.json({ vendors });
    } catch (error) {
        console.error('Error retrieving vendors:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getVendorById = async(req, res)=>{
    const vendorId = req.params.id;
    try{
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if(!vendor){
            return res.status(404).json({error: "Vendor not found"})

        }
        res.status(200).json({vendor})
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({error: "Internal Server error"})
    }
}

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById };
