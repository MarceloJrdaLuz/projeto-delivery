import Transaction from "../models/transaction"
import TransactionServices from "../services/TransactionServices"

class PostbackController {
    async pagseguro(req, res){
        const { id, status, paid_at } = req.body

        try {
            const transaction =  await Transaction.findOne({transactionId: id})

            const service = new TransactionServices()
            await service.updateStatus({
                code: transaction.code,
                providerStatus: status
            })

            res.status(200).json()
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error'})
        }

    }
}

export default new PostbackController()