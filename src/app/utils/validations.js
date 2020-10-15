/* eslint-disable import/prefer-default-export */
import { unformat } from './functions';

export function isValidCPF(number) {
  let sum;
  let rest;
  let i;
  sum = 0;
  if (number === undefined || number === '00000000000') return false;

  number = unformat(number);

  for (i = 1; i <= 9; i++)
    sum += parseInt(number.substring(i - 1, i)) * (11 - i);
  rest = (sum * 10) % 11;

  if (rest == 10 || rest == 11) rest = 0;
  if (rest != parseInt(number.substring(9, 10))) return false;

  sum = 0;
  for (i = 1; i <= 10; i++)
    sum += parseInt(number.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;

  if (rest == 10 || rest == 11) rest = 0;
  if (rest != parseInt(number.substring(10, 11))) return false;
  return true;
}
