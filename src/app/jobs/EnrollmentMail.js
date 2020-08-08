import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { studentName, studentEmail } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${studentName} <${studentEmail}>`,
      subject: 'Confirmação de inscrição',
      template: 'enrollment',
      context: data,
    });
  }
}

export default new EnrollmentMail();
