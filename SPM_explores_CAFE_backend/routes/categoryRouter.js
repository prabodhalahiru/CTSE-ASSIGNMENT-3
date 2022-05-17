const router = require('express').Router()
const categoryCtrl = require('../controllers/categoryCtrl')

router.route('/category')
    .get(categoryCtrl.getCategory)
    .post(categoryCtrl.createCategory)

router.route('/category/:id')
    .delete(categoryCtrl.deleteCategory)
    .put(categoryCtrl.updateCategory)

module.exports = router