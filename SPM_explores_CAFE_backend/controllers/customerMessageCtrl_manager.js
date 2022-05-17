const Messages = require('../models/customerMessageModel_manager')

const customerMessageCtrl_manager = {
    getMessages: async (req, res) => {
        try {
            const messages = await Messages.find()
            res.json(messages)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    placeMessage: async (req, res) => {
        try {
            const {userName, message} = req.body;

            const newMessage = new Messages({userName, message})
            await newMessage.save()
            res.json({msg: "Added new Message."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = customerMessageCtrl_manager