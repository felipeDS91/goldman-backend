import { ValidationError as Err } from 'yup';

class ValidationError extends Err {
  constructor(messages) {
    super();
    this.inner = messages;
  }
}

export default ValidationError;
