import axios from 'axios';
import dataBoletoVencimento from '../functions/dataBoleto';
import getRndInteger from '../functions/gerarIdAleatorio';
import { api } from '../services/apiPagSeguro';
import { estado } from '../utils/arrayEstados';
import('dotenv')

class PagSeguro {
    async process({
        transactionCode,
        total,
        paymentType,
        installments,
        creditCard,
        customer,
        billing,
        items
    }) {

        const amount = {
            amount: {
                value: total * 100,
                currency: 'BRL'
            }
        }

        const referenceDefault = {
            reference_id: transactionCode,
            description: 'Pagamento'
        }

        const options = {
            headers: {
                'Authorization': `${process.env.PAGSEGURO_TOKEN}`
            }
        }

        const webHookUrl = {
            notification_url: [
                `${process.env.PAGSEGURO_WEBHOOK_URL}`
            ]
        }

        const billetParams = {
            payment_method: {
                type: "BOLETO",
                boleto: {
                    due_date: `${dataBoletoVencimento(2)}`,
                    instruction_lines: {
                        line_1: "Pagamento processado para DESC Fatura",
                        line_2: "Via PagSeguro"
                    },
                    holder: {
                        name: customer.name,
                        tax_id: getRndInteger(11111111111, 99999999999),
                        email: customer.email,
                        address: {
                            street: billing.address,
                            number: billing.number,
                            locality: billing.neighborhood,
                            city: billing.city,
                            region: estado(billing.state),
                            region_code: billing.state,
                            country: "Brasil",
                            postal_code: billing.zipcode.replace(/[^a-z0-9]/gi,'')
                        }
                    }
                }
            },
        }

        const creditCardParams = {
            payment_method: {
                card: {
                    holder: { name: creditCard.holderName },
                    number: creditCard.number.replace(/[^?0-9]/g, ""),
                    exp_month: creditCard.exp_month,
                    exp_year: creditCard.exp_year,
                    security_code: creditCard.cvv
                },
                type: 'CREDIT_CARD',
                installments: installments,
                capture: true
            },
        }

        let paymentParams;

        switch (paymentType) {
            case "credit_card":
                paymentParams = creditCardParams
                break;
            case "billet":
                paymentParams = billetParams
                break;

            default:
                throw `PaymentType ${paymentType} not found.`
                break;
        }

        //         const customerParams = {
        //             customer: {
        //                 external_id: customer.email,
        //                 name: customer.name,
        //                 email: customer.email,
        //                 type: cpf.isValid(customer.document) ? "individual" : "corporation",
        //                 country: 'br',
        //                 phone_numbers: [customer.mobile],
        //                 documents: [
        //                     {
        //                         type: cpf.isValid(customer.document) ? 'cpf' : 'cnpj',
        //                         number: customer.document.replace(/[^?0-9]/g, ""),

        //                     }
        //                 ]
        //             }
        //         }

        const billingParams = billing?.zipcode ? {
            address: {
                country: 'br',
                region: billing.state,
                city: billing.city,
                locality: billing.neighborhood,
                street: billing.address,
                number: billing.number,
                postal_code: billing.zipcode.replace(/[^?0-9]/g, "")
            }
        } : {}

        //         const itemsParams = items && items.length > 0 ? {
        //             items: items.map((item) => ({
        //                 id: item?.id.toString(),
        //                 title: item?.title,
        //                 unit_price: item?.amount * 100,
        //                 quantity: item?.quantity || 1,
        //                 tangible: false
        //             }))
        //         } : {
        //             items: [
        //                 {
        //                     id:"1",
        //                     title: `t-${transactionCode}`,
        //                     unit_price: total * 100,
        //                     quantity: 1,
        //                     tangible: false
        //                 }
        //             ]
        //         }

        const metadataParams = {
            metadata: {
                transaction_code: transactionCode
            }
        }

        const transactionsParams = {
            ...amount,
            ...paymentParams,
            ...referenceDefault,
            ...metadataParams,
            ...webHookUrl
        }

        //         const client = await pagarme.client.connect({
        //             api_key: process.env.PAGARME_API_KEY,
        //         })

        // const response = await client.transactions.create(transactionsParams)

        //         return {
        //             transactionId: response.id,
        //             status: this.translateStatus(response.status),
        //             billet: {
        //                 url: response.boleto_url,
        //                 barCode: response.boleto_barcode
        //             },
        //             card: {
        //                 id: response.card?.id,
        //             },
        //             processorResponse: JSON.stringify(response)
        //         }
        //     }
       
        const responsePagSeguro = api.post('/charges', { ...transactionsParams }, options)
            .then(res => {
                const response = res.data
                const urls = response.payment_method.type === 'BOLETO' ? {
                    billet: {
                        url: response.links[0].href,
                        barcode: response.payment_method.boleto.barcode,
                        barcode_formatted: response.payment_method.boleto.formatted_barcode,
                    },
                } : {}

                console.log(response)

                return {
                    transactionId: response.id,
                    status: this.translateStatus(response.status),
                    billet: urls,
                    processorResponse: JSON.stringify(response),  
                }
            })
            .catch(err => console.log(err));

        return responsePagSeguro
    }

    translateStatus(responseStatus) {
        const statusMap = {
            PAID: "approved",
            WAITING: "pending",
            AUTHORIZED: "pending",
            DECLINED: "refused",
            CANCELED: "refunsed",
        }
        return statusMap[responseStatus]
    }

}

export default PagSeguro