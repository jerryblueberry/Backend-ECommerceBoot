const asyncHandler = require('express-async-handler');
const Product = require('../models/product-model');

const addProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      category,
      subCategory,
      size,
      rating,
      review,
      description,
      price,
      quantity,
      sku,
      discount,
      tags,
      brand,
      dateAdded,
      dimensions,
      weight,
      status,
      description1,
      description2,
      ram,
      storage,
      offers,
      highlights
    } = req.body;
    const { storeId } = req.params;

    if (
      !name ||
      !category ||
      !subCategory ||
      !description ||
      !price ||
      !quantity ||
      !storeId ||
      !sku
    ) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const imageFiles = req.files['images'] ? req.files['images'].map((file) => file.path) : [];
    const colorFiles = req.files['color'] ? req.files['color'].map((file) => file.path) : [];
    const descriptionImage1 = req.files['description1Img'] ? req.files['description1Img'][0].path : null;
    const descriptionImage2 = req.files['description2Img'] ? req.files['description2Img'][0].path : null;

    // Parse ram, storage, and offers if they are strings within an array
    const parsedRam = ram ? ram.split(',').map(Number) : [];
    const parsedStorage = storage ? storage.split(',').map(Number) : [];
    const parsedOffers = offers ? offers.split(',').map(offer => offer.trim()) : [];
    const parsedHighlights = highlights ? highlights.split(',').map(highlight => highlight.trim()):[];
    const newProduct = new Product({
      name,
      category,
      subCategory,
      color: colorFiles,
      size,
      rating,
      review,
      description,
      price,
      quantity,
      images: imageFiles,
      storeId,
      sku,
      discount,
      tags,
      brand,
      dateAdded,
      dimensions,
      weight,
      status,
      ram: parsedRam,
      storage: parsedStorage,
      offers: parsedOffers,
      productDescription: {
        description1,
        description2,
        description1Img: descriptionImage1,
        description2Img: descriptionImage2,
      },
      highlights:parsedHighlights,
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('storeId', 'name');
    console.log(products);
    res.status(200).json({ products });
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
};

//  get the products by category and the filters

// const mobileApi = asyncHandler(async (req, res) => {
//   try {
//     const { priceRange, brand, ratings, color } = req.query;

//     // Parse the filters
//     const [minPrice, maxPrice] = priceRange ? priceRange.split(',').map(Number) : [0, Infinity];
//     const brandFilter = brand ? { brand: new RegExp(brand, 'i') } : {};

//     // Parse and convert ratings to strings
//     const ratingsArray = ratings ? ratings.split(',').map(rating => rating.trim()) : [];
//     const ratingsFilter = ratingsArray.length ? { rating: { $in: ratingsArray } } : {};

//     // Create the filter object
//     const filter = {
//       ...brandFilter,
//       ...ratingsFilter,
//       price: { $gte: minPrice, $lte: maxPrice }
//     };

//     const products = await Product.find(filter);
//     res.json(products);
//   } catch (error) {
//     console.error("Error Fetching products", error);
//     res.status(500).json({ error: error.message });
//   }
// });

const mobileApi = asyncHandler(async (req, res) => {
  try {
    const { priceRange, brand, ratings, color } = req.query;

    // Parse the filters
    const [minPrice, maxPrice] = priceRange ? priceRange.split(',').map(Number) : [0, Infinity];
    const brandFilter = brand ? { brand: new RegExp(brand, 'i') } : {};

    // Parse and convert ratings range to numbers
    const [minRating, maxRating] = ratings ? ratings.split(',').map(Number) : [0, 5];
    const ratingsFilter = { rating: { $gte: minRating, $lte: maxRating } };

    // Create the filter object
    const filter = {
      ...brandFilter,
      ...ratingsFilter,
      price: { $gte: minPrice, $lte: maxPrice }
    };

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error("Error Fetching products", error);
    res.status(500).json({ error: error.message });
  }
});


const fetchProductsForBrand = async (brand) => {
  try {
    const products = await Product.find({ brand: new RegExp(brand, 'i') }).limit(5);
    return products;
  } catch (error) {
    console.error(`Error fetching products for brand ${brand}`, error);
    return [];
  }
};



const fetchProductsForAllBrandsMobile = async (brands) => {
  const brandList = brands.slice(0, 5); // Limit to 5 brands
  const productPromises = brandList.map(brand => fetchProductsForBrand(brand));
  const allProducts = await Promise.all(productPromises);
  return allProducts.flat(); 
};

//  get the products from each brand for mobile phone
const mobileBrands = asyncHandler(async (req, res) => {
  try {
    const { brands } = req.query;

    if (!brands) {
      return res.status(400).json({ error: "Brands query parameter is required" });
    }

    const brandList = brands.split(',').map(brand => brand.trim());
    const products = await fetchProductsForAllBrandsMobile(brandList);
    res.status(200).json(products);
  } catch (error) {
    console.error("Internal Server Error", error);
    res.status(500).json({ error: error.message });
  }
});



// get products detail
const getProductDetails = asyncHandler(async (req, res) => {
  try {
    const { sku } = req.params;

    if (!sku) {
      return res.status(404).json({ error: 'Sku of a product must be provided' });
    }

    // Fetch the main product
    const product = await Product.findOne({ sku }).populate('storeId', 'name address');

    if (!product) {
      return res.status(404).json({ error: 'Product Not found' });
    }

    // Check if the storeId is populated
    const storeId = product.storeId ? product.storeId._id : null;

    // Fetch similar products based on category and/or brand
    const similarProducts = await Product.find({
      category: [product.category||product.brand],
      _id: { $ne: product._id } // Exclude the current product
    }).limit(5);

    // Fetch other products from the same vendor if storeId is available
    const vendorProducts = storeId
      ? await Product.find({
          storeId,
          _id: { $ne: product._id } // Exclude the current product
        }).limit(5)
      : [];

    res.status(200).json({
      product,
      recommendations: {
        similarProducts,
        vendorProducts
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const updateProduct = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, description, price, quantity, category, rating } = req.body;

    const product = await Product.findByIdAndUpdate(productId, {
      name,
      description,
      price,
      quantity,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  left for the product
module.exports = { getProducts, addProduct, getProductDetails,mobileApi,mobileBrands};
