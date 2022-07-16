import * as Yup from 'yup'
import parsePhoneNumber from 'libphonenumber-js'
import { cpf, cnpj } from 'cpf-cnpj-validator'
import Cart from '../models/cart'
import User from '../models/user'
import TransactionServices from "../services/TransactionServices"
import { estadosSiglas } from '../utils/arrayEstados'

class TransactionsControllers {
    async create(req, res) {
        try {
            const {
                cartCode,
                paymentType,
                installments,
                customerName,
                customerEmail,
                customerMobile,
                customerDocument,
                billingAddress,
                billingNumber,
                billingNeighborhood,
                billingCity,
                billingState,
                billingZipCode,
                creditCardNumber,
                creditCardExpiration,
                exp_month,
                exp_year,
                creditCardHolderName,
                creditCreditCardCvv,
            } = req.body

            const schema = Yup.object({
                cartCode: Yup.string().required(),
                paymentType: Yup.mixed().oneOf(["credit_card", "billet"]).required(),
                installments: Yup.number().min(1)
                    .when("paymentType", (paymentType, schema) =>
                        paymentType === 'credit_card' ? schema.max(12) : schema.max(1)),
                customerName: Yup.string().required().min(3),
                customerEmail: Yup.string().required().email(),
                customerMobile: Yup.string().required()
                    .test("is-valid-mobile", "${path} is not a mobile number",
                        (value) => parsePhoneNumber(value, "BR").isValid()),
                customerDocument: Yup.string().required()
                    .test("is-valid-document", "${path} is not a valid CPF / CPNJ",
                        (value) => cpf.isValid(value) | cnpj.isValid(value)),
                billingAddress: Yup.string().required(),
                billingNumber: Yup.string().required(),
                billingNeighborhood: Yup.string().required(),
                billingCity: Yup.string().required(),
                // billingState: Yup.string().required(),
                billingState: Yup.mixed().oneOf([estadosSiglas]).required(),
                billingZipCode: Yup.string().required(),
                creditCardNumber: Yup.string()
                    .when("paymentType", (paymentType, schema) => paymentType === "credit_card" ? schema.required() : schema),
                // creditCardExpiration: Yup.string()
                //     .when("paymentType", (paymentType, schema) => paymentType === "credit_card" ? schema.required() : schema),
                exp_month: Yup.number().required(),
                exp_year: Yup.number().required(),
                creditCardHolderName: Yup.string()
                    .when("paymentType", (paymentType, schema) => paymentType === "credit_card" ? schema.required() : schema),
                creditCreditCardCvv: Yup.string()
                    .when("paymentType", (paymentType, schema) => paymentType === "credit_card" ? schema.required() : schema),
            })

            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: "Error on validate Schema" })
            }

            const cart = await Cart.findOne({ code: cartCode })

            if (!cart) {
                return res.status(404).json()
            }

            const userRegistered = await User.findOne({ email: customerEmail})

            if(!userRegistered){
                return res.status(404).json({
                    error: "User not found"
                })
            }

            const service = new TransactionServices()
            const response = await service.process({
                cartCode,
                paymentType,
                installments,
                customer: {
                    name: customerName,
                    email: customerEmail,
                    mobile: parsePhoneNumber(customerMobile, "BR").format("E.164"),
                    document: customerDocument,
                },
                billing: {
                    address: billingAddress,
                    number: billingNumber,
                    neighborhood: billingNeighborhood,
                    city: billingCity,
                    state: billingState,
                    zipcode: billingZipCode,
                },
                creditCard: {
                    number: creditCardNumber,
                    expiration: creditCardExpiration,
                    exp_month: exp_month, 
                    exp_year: exp_year, 
                    holderName: creditCardHolderName,
                    cvv: creditCreditCardCvv
                }
            })
            return res.status(200).json(response)

        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: "Internal server error" })
        }
    }
}

export default new TransactionsControllers()