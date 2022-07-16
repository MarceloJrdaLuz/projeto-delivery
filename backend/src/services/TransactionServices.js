import Cart from '../models/cart'
import Transaction from "../models/transaction";
import { v4 as uuidv4 } from 'uuid'
import PagSeguro from '../provider/PagSeguro';

class TransactionServices {

    paymentProvider;

    constructor(paymentProvider) {
        this.paymentProvider = paymentProvider || new PagSeguro()
    }

    async process({
        cartCode,
        paymentType,
        installments,
        customer,
        billing,
        creditCard,
    }) {
        const cart = await Cart.findOne({ code: cartCode })

        if (!cart) {
            throw `Cart ${cartCode} was not found`
        }
        const transaction = await Transaction.create({
            cartCode: cart.code,
            code: uuidv4(),
            total: cart.price,
            paymentType,
            installments,
            status: "started",
            customerName: customer.name,
            customerEmail: customer.email,
            customerMobile: customer.mobile,
            customerDocument: customer.document,
            billingAddress: billing.address,
            billingNumber: billing.number,
            billingNeighborhood: billing.neighborhood,
            billingCity: billing.city,
            billingState: billing.state,
            billingZipCode: billing.zipcode,
            creditCard,
        })

        const response = await this.paymentProvider.process({
            transactionCode: transaction.code,
            total: transaction.total,
            paymentType,
            installments,
            customer,
            creditCard,
            billing
        })

        await transaction.updateOne({
            transactionId: response.transactionId,
            status: response.status,
            processorResponse: response.processorResponse,
        })

        return response

    }

    async updateStatus({ code, providerStatus }) {
        const transaction = await Transaction.findOne({ code })

        if (!transaction) {
            throw `Transaction ${code} not found`
        }

        const status = await this.paymentProvider.translateStatus(providerStatus)

        if (!status) {
            throw 'Status não existe'
        }

        await transaction.updateOne({ status })
    }
}

export default TransactionServices