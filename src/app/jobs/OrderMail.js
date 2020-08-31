import Mail from '../../lib/Mail';

class OrderMail {
  get key() {
    return 'OrderMail';
  }

  async handle({ data }) {
    const { customer } = data;

    await Mail.sendMail({
      to: `${customer.name} <${customer.email}>`,
      subject: 'Confirmação de pedido',
      template: 'order',
      context: data,
    });
  }
}

export default new OrderMail();
