const jwt = require('jsonwebtoken')

 
const auth = (req, res, next) =>{
    try{
        //authorization token
        const token = req.header("Authorization")
        if(!token) return res.status(400).json({msg: "Invalid Authentication"})

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
            if(err) return res.status(400).json({msg: "Invalid Authentication"})

           req.user = user
           next() 
        })
    } catch (err) {
        return res.status(500).json({msg:err.message})
    }
}
 
// const auth = (req, res, next) => {
//     try {
//         const token = req.header("Authorization")
//         if(!token) return res.status(400).json({msg: "Invalid Authentication"})

//         jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, employee) => {
//             if(err) return res.status(400).json({msg: "Invalid Authentication"})

//             req.employee = employee
//             next()
//         })
//     } catch (err) {
//         return res.status(500).json({msg: err.message})
//     }
// }

 
module.exports = auth