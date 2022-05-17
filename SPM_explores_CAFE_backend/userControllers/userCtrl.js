const Users = require('../userModels/userModel')

//password encrypted using bcrypt
const bcrypt = require('bcrypt')

//user authentication using jsonwebtoken
const jwt = require('jsonwebtoken');



const userCtrl = {

    register: async(req, res) => {
        try{

            const {name, email, mobile, role, password} = req.body;

            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: "The email already exists"})

            if(password.length < 6)
            return res.status(400).json({msg: "Password Should be at least 6 Characters"})

            if(mobile.length < 10)
            return res.status(400).json({msg: "There should be 10 Digits for mobile Number"})

            

            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name, email,mobile,role, password: passwordHash
            })

            //  no need -- const password = await (password,10)
            // const newUser = new Users({
            //     name, email,mobile,role, password
            // })

            //test comment



            //Save mongodb using save()
            await newUser.save()

            const accesstoken = createAccessToken({id: newUser._id})
            const refreshtoken = createRefreshToken({id: newUser._id})
            // res.json({msg:"Successfully Registered!!"})

            res.cookie('refreshtoken', refreshtoken,{
                httpOnly: true,
                path: '/user/refresh_token'
            })

            
            res.json({accesstoken})
           

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    login: async(req,res) => {
        try{
            const {email, password} = req.body;

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "User does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Password is Incorrect..Please try again"})
            // const isMatch = await (password, user.password)
            // if(!isMatch) return res.status(400).json({msg: "Password is Incorrect..Please try again"})


            //after successfully login to the system. create access token and refresh token
            const accesstoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})
            

            res.cookie('refreshtoken', refreshtoken,{
                httpOnly: true,
                path: '/user/refresh_token'
            })

            
            res.json({accesstoken})
            


        }catch(err){

            return res.status(500).json({msg: err.message})

        }

    },
    logout: async(req,res) => {
        try{
            res.clearCookie('refreshtoken',{path:'/user/refresh_token'})
            return res.json({msg: "Logout successfully"})

        }catch(err){
            return res.status(500).json({msg: err.message})
        }

    },

    refreshToken: (req, res) =>{
        try{
        const rf_token = req.cookies.refreshtoken;
        if(!rf_token) return res.status(400).json({msg:"please login or register"})

        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET,(err,user) =>{
            if(err) return res.status(400).json({msg:"Please Login or Register"})
            const accesstoken = createAccessToken({id: user.id})
            res.json({accesstoken})
        })
        
        //res.json({accesstoken})
        }
        catch(err){return res.status(500).json({msg: err.message})}
    },
    getUser: async (req,res) =>{
        try{
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg: "User Does not exist  (Auth)"})
            
            res.json(user)
        }catch(err){
           return res.status(500).json({msg:err.message}) 
        }
    },
    addCart: async (req,res) =>{
        try{
            const user = await Users.findById(req.user.id)
            if(!user) return res.status(400).json({msg:"User does not exist"})

            await Users.findOneAndUpdate({_id: req.user.id},{
                cart: req.body.cart
            })
        }catch(err){
            return res.status(500).json({msg:err.message}) 
        }
    }
}


const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'1d'})
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'7d'})
}

module.exports = userCtrl