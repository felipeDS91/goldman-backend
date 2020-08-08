import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'AnswerHelpOrderMail';
  }

  async handle({ data }) {
    const { studentName, studentEmail } = data;
    wwwwwwwwwwwwwqs;
    console.log('A fila executou');

    await Mail.sendMail({
      to: `${studentName} <${studentEmail}>`,
      subject: 'Dúvida respondida',
      template: 'answerhelpOrder',
      context: data,
    });
  }
}

export default new EnrollmentMail();
