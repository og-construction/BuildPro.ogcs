const mongoose = require('mongoose');



const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'seller', required: true },
    //image: { type: String, required:true },
      // ...other fields
      visibilityLevel: {
        type: String,
        enum: ['1X', '2X', '3X', '4X'], // Ensures it’s one of these values
        default: '1X' // Default if not specified
    },
    videoPriority: { type: Boolean, default: false }, // true if 3X video priority is chosen
    slug: String,
    specifications :[{
                 key:{type: String},
                 value:{type:String}
    }],
    approved: { type: Boolean, default: false },
    ratings: [{
        star: { type: Number, required: true },
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    totalratings: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
