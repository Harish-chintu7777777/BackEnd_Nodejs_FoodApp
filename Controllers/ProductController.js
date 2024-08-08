const Firm = require("../models/Firm");
const Product = require("../models/Product");
const path = require('path');
const multer = require('multer');  // Assuming multer is being used

// Define upload directory (ensure this is defined somewhere in your code)
const uploadDir = path.join(__dirname, '../uploads');

// Set storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadDir);  // Ensure 'uploadDir' is defined
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));  // Save file with timestamp
    }
});

// Init Upload
const upload = multer({
    storage: storage
});

const addProduct = async (req, res) => {
    try {
        const { productName, price, category, bestSeller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const firmId = req.params.firmId;

        // Find the firm by ID
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ error: "No firm found" });
        }

        // Create a new product
        const product = new Product({
            productName,
            price,
            category,
            bestSeller,
            description,
            image,
            firm: firm._id  // Associate the product with the firm
        });

        // Save the product to the database
        const savedProduct = await product.save();
        firm.products.push(savedProduct)
        // Optionally, add product to firm's product list (if such a relationship exists)
        // firm.products.push(savedProduct._id);
        // await firm.save();

        res.status(200).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


const getProductByFirm = async(req,res)=>{
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId)
        if(!firm){
            return res.status(404).json({error: "Nor firm found"})
        }
        const restaurantName = firm.firmName
        const products = await Product.find({firm: firmId})
        res.status(200).json({restaurantName,products})
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal server error"})
    }
}

const deleteProductById = async(req, res) => {
    try {
        const productId = req.params.productId;

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: "No product found" })
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }
}
module.exports = { addProduct: [upload.single('image'), addProduct] ,getProductByFirm,deleteProductById};
