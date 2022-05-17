const Category = require('../models/categoryModel')
const categoryCtrl = {
    getCategory: async (req, res) => {
        try {
            const category = await Category.find()
            res.json(category)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createCategory: async (req, res) => {
        try {
            const {category_id, categoryName, status, images} = req.body;
            if(!images) return res.status(400).json({msg: "No image upload"})

            const category = await Category.findOne({category_id})

            if(category)
                return res.status(400).json({msg: "This category already exists."})

            const newCategory = new Category({
                category_id,
                categoryName: categoryName.toLowerCase(),
                status,
                images
            })
            await newCategory.save()
            res.json({msg: "Created."})
            

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteCategory: async (req, res) => {
        try {
            await Category.findByIdAndDelete(req.params.id)
            res.json({msg: "Delete the category"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateCategory: async (req, res) => {
        try {
            const {categoryName, status, images} = req.body;

            if(!images) return res.status(400).json({msg: "No image upload"})

            await Category.findOneAndUpdate({_id: req.params.id}, {
                categoryName: categoryName.toLowerCase(),
                status,
                images
            })

            res.json({msg: "Updated a Category"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = categoryCtrl