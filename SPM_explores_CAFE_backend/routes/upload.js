const router = require('express').Router()
const cloudinary = require('cloudinary')
//const auth = require('../middleware/auth')
//const authManager = require('../middleware/authManager')
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

//upload an image
router.post('/upload', (req, res) => {
    try {
        console.log(req.files)
        if(!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({msg: 'No files were uploaded.'})

        const file = req.files.file;
        if(file.size > 1024*1024*3){
            removeTemp(file.tempFilePath)
            return res.status(400).json({msg: "Size is too large"})
        }

        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTemp(file.tempFilePath)
            return res.status(400).json({msg: "File format is incorrect."})
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "SPM"}, async(err, result) => {
            if(err) throw err;
            removeTemp(file.tempFilePath)
            res.json({public_id: result.public_id, url: result.secure_url})
        })
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
})

//delete uploaded images
router.post('/destroy', (req, res) => {
    try {
        const {public_id} = req.body;
        if(!public_id) return res.status(400).json({msg: "No images Selected"})

        cloudinary.v2.uploader.destroy(public_id, async(err, result) => {
            res.json({msg: "Image Deleted."})
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const removeTemp = (path) => {
    fs.unlink(path, err => {
        if(err) throw err;
    })
}

module.exports = router