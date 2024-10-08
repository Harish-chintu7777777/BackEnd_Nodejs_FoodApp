// const Firm = require('../models/Firm');
// const Vendor = require('../models/Vendor');
// const multer = require('multer');
// const fs = require('fs');
// const Firm = require('../models/Firm')
// const path = require('path');

// // Ensure uploads directory exists
// const uploadDir = './uploads';
// if (!fs.existsSync(uploadDir)){
//     fs.mkdirSync(uploadDir);
// }

// // Set storage engine
// const storage = multer.diskStorage({
//     destination: uploadDir,
//     filename: function(req, file, cb){
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// // Init Upload
// const upload = multer({
//     storage: storage
// });

// const addFirm = async (req, res) => {
//     try {
//         const { firmName, area, category, region, offer } = req.body;
//         const image = req.file ? req.file.filename : undefined;
        
//         const vendor = await Vendor.findById(req.vendorId);
//         if (!vendor) {
//             return res.status(404).json({ message: "Vendor not found" });
//         }
//         const firm = new Firm({
//             firmName, area, category, region, offer, image,
//             vendor: vendor._id 
//         });

//         const savedFirm = await firm.save();
//         vendor.firm.push(savedFirm)
//         await vendor.save()
//         return res.status(200).json({ message: 'Firm added Successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json("Internal Server Error");
//     }
// };
// const deleteFirmById = async(req, res) => {
//     try {
//         const firmId = req.params.firmId;

//         const deletedProduct = await Firm.findByIdAndDelete(firmId);

//         if (!deletedProduct) {
//             return res.status(404).json({ error: "No product found" })
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal server error" })
//     }
// }
// module.exports = { addFirm: [upload.single('image'), addFirm],deleteFirmById };


const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set storage engine
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage
});

const addFirm = async (req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id 
        });

        const savedFirm = await firm.save();
        vendor.firms.push(savedFirm._id); // Push firm ID instead of the full object
        await vendor.save();

        return res.status(200).json({ message: 'Firm added Successfully', firmId: savedFirm._id });
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
};

const deleteFirmById = async (req, res) => {
    try {
        const firmId = req.params.firmId;

        const deletedFirm = await Firm.findByIdAndDelete(firmId);

        if (!deletedFirm) {
            return res.status(404).json({ error: "No firm found" });
        }

        return res.status(200).json({ message: "Firm deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { addFirm: [upload.single('image'), addFirm], deleteFirmById };
