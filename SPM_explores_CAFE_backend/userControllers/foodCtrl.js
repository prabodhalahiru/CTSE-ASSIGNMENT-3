const Foods = require('../userModels/foodModel')


class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filtering(){
        const queryObj = {...this.queryString} //queryString = req.query       

        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete(queryObj[el]))  

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|It|Ite|regex)\b/g, match => '$' + match) 
        
        //gt = greater than
        // lt= less than 
        // lte= less than or equal        

        this.query.find(JSON.parse(queryStr))

        return this;
    }

    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else {
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 6
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }

}



const foodCtrl = {
    getFoods: async(req, res) => {
        try {
            
            const features = new APIfeatures(Foods.find(), req.query).filtering().sorting().paginating()
            const foods = await features.query
            // // features.query

            //TEST

            // const foods = await features.query
            //TEST END 

            res.json({
                status: 'success',
                result: foods.length,
                foods: foods
            })
            // res.json(foods)
             

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    createFood: async(req, res) => {
        try {
            const {food_id, name, description, ingredients, images, price, status, category} = req.body;
            // // if(!images) return res.status(400).json({msg: "Please Upload an Image!"})

            const food = await Foods.findOne({food_id})
            if(food)
                return res.status(400).json({msg: "This Product already exists!"})

                const newFood = new Foods({
                    food_id, 
                    name, 
                    description,
                    ingredients, 
                    images, 
                    price, 
                    status, 
                    category
                })

                await newFood.save()
                 
                res.json({msg: "New Food Item Created!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteFood: async(req, res) => {
        try {
            await Foods.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a Food Item!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateFood: async(req, res) => {
        try {
            const {name, description, ingredients, images, price, status, category} = req.body;
            // // if(!images) return res.status(400).json({msg: "Please Upload an Image!"})

            await Foods.findOneAndUpdate({_id: req.params.id}, {
                name, 
                description, 
                ingredients, 
                images, 
                price, 
                status, 
                category
            })

            res.json({msg: "Updated a Food Item!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

}

module.exports = foodCtrl