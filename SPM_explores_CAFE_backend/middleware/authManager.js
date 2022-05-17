const Employees = require('../models/empModel')

const authManager = async (req, res, next) => {
    try {
        const employee = await Employees.findOne({
            _id: req.employee.id
        })
        if(employee.role === 0)
            return res.status(400).json({msg: "Manager access denied."})

        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authManager