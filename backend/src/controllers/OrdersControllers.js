import Transaction from '../models/transaction'
import * as Yup from 'yup'
import Order from '../models/order'
import parsePhoneNumber from 'libphonenumber-js'

class OrdersControllers {
  async getOrders (req, res) {
    try {
      const {
        userEmail
      } = req.body

      const orders = await Transaction.find({ customerEmail: userEmail })
      return res.status(200).json(orders)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async newOrder (req, res) {
    try {
      const {
        paymentType,
        transshipmentFor, // opcao de passar para quanto precisa troco
        customerName,
        customerNumber,
        billingStreet,
        billingNumber,
        billingNeighborhood,
        billingComplement,
        billingReference,
        items
      } = req.body

      const schema = Yup.object({
        paymentType: Yup.mixed().oneOf(['credit_card', 'pix', 'cash']).required(),
        transshipmentFor: Yup.number().required(),
        customerName: Yup.string().required(),
        customerNumber: Yup.string().required()
          .test('is-valid-mobile', '${path} is not a mobile number',
            (value) => parsePhoneNumber(value, 'BR').isValid()),
        billingStreet: Yup.string().required(),
        billingNumber: Yup.number().required(),
        billingNeighborhood: Yup.string().required(),
        billingComplement: Yup.string().required(),
        billingReference: Yup.string().required(),
        items: Yup.array().required()
      })
      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Error on validate Schema' })
      }

      const orderTotal = () => {
        let total = 0
        items.map(item => {
          total += item.qtd * item.value
        })
        return total
      }

      const orderId = await Order.find().count() + 1

      const newOrder = await Order.create({
        orderNumber: orderId,
        items,
        total: orderTotal() * 100
      })

      const formatPaymentType = (paymentType) => {
        switch (paymentType) {
          case 'credit_card':
            return 'Pagamento no Cartão'.replace(/ /g, '%20')
          case 'pix':
            return 'Pagamento no Pix'.replace(/ /g, '%20')
          case 'cash':
            return `Pagamento em dinheiro. Troco para ${transshipmentFor.toFixed(2).replace('.', ',')}`.replace(/ /g, '%20')
          default:
            break
        }
      }

      return res.status(201).json({
        linkTo: `https://api.whatsapp.com/send?phone=${process.env.WHATS_NUMBER}&text=%E2%9C%85%20NOVO%20PEDIDO%0A%0A-------------------%0A%E2%96%B6%20RESUMO%20DO%20PEDIDO%0A%0APedido%20${orderId}%0A%0A${items.map(item => `${item.qtd}x%20%20${item.itemName}%20%20(R$${item.value.toFixed(2).replace('.', ',')})%0A%0ASubtotal%20do%20item:%20R$%20${(item.value * item.qtd).toFixed(2).replace('.', ',')}%0A-------------------%0A%0A`)}%E2%96%B6%20DADOS%20PARA%20ENTREGA%0A%0ANome:%20${customerName.replace(/ /g, '%20')}%0ARua:%20${billingStreet.replace(/ /g, '%20')},%20n%20.${billingNumber}%0A${billingNeighborhood.replace(/ /g, '%20')}%0AComplemento:${billingComplement.replace(/ /g, '%20')}%0AReferência:${billingReference.replace(/ /g, '%20')}%0ATelefone:${customerNumber.replace(' ', '')}%0A%0A-------------------%0A%E2%96%B6%20TOTAL%20=%20R$%20${orderTotal().toFixed(2).replace('.', ',')}%0A-------------------%0A%0A%E2%96%B6%20Pagamento%0A%0A${formatPaymentType(paymentType)}`
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  async ordersClean (req, res) {
    try {
      const orders = await Order.deleteMany({})
      return res.status(200).json({ message: 'Collection delete sucess' })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export default new OrdersControllers()
