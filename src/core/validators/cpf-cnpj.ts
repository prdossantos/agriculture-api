export const isValidCPFOrCNPJ = (document: string): boolean => {
  if (!/^\d{11}$|^\d{14}$/.test(document)) {
    return false;
  }

  if (document.length === 11) {
    return isValidCPF(document);
  }

  if (document.length === 14) {
    return isValidCNPJ(document);
  }

  return false;
};

const isValidCPF = (cpf: string): boolean => {
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  const calculateDigit = (cpf: string, factor: number) =>
    cpf
      .slice(0, factor - 1)
      .split('')
      .reduce((sum, num, index) => sum + parseInt(num) * (factor - index), 0) %
    11;

  const firstDigit = calculateDigit(cpf, 10);
  const secondDigit = calculateDigit(cpf, 11);

  return (
    (firstDigit < 2
      ? parseInt(cpf[9]) === 0
      : parseInt(cpf[9]) === 11 - firstDigit) &&
    (secondDigit < 2
      ? parseInt(cpf[10]) === 0
      : parseInt(cpf[10]) === 11 - secondDigit)
  );
};

const isValidCNPJ = (cnpj: string): boolean => {
  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  const calculateDigit = (cnpj: string, factor: number[]) =>
    cnpj
      .slice(0, factor.length)
      .split('')
      .reduce((sum, num, index) => sum + parseInt(num) * factor[index], 0) % 11;

  const firstFactor = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondFactor = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const firstDigit = calculateDigit(cnpj, firstFactor);
  const secondDigit = calculateDigit(cnpj, secondFactor);

  return (
    (firstDigit < 2
      ? parseInt(cnpj[12]) === 0
      : parseInt(cnpj[12]) === 11 - firstDigit) &&
    (secondDigit < 2
      ? parseInt(cnpj[13]) === 0
      : parseInt(cnpj[13]) === 11 - secondDigit)
  );
};
