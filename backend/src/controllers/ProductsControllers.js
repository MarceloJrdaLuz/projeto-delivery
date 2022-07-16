import Products from "../models/products"

class ProductsControllers {
    async create(req, res) {
        try {
            const {
                code,
                price,
                category,
                productName,
                description
            } = req.body

            const products = await Products.create({
                code,
                price,
                category,
                productName,
                description
            })
            return res.status(200).json(products)
        } catch (err) {
            console.error(err)
            return res.status(500).json({ error: "Internal server error" })
        }
    }

    async getProducts(req, res){
        const { category } = req.params
        try {
            if(category === 'all'){
                const products = await Products.find({})  
                return res.status(200).send({products})
            }
            const products = await Products.find({category: category})
            return res.status(200).send({products})
        } catch (error) {
            console.error(err)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
}

export default new ProductsControllers()