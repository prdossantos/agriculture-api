import { isValidCPFOrCNPJ } from './cpf-cnpj';

describe('isValidCPFOrCNPJ', () => {
  describe('CPF validation', () => {
    it('should return true for a valid CPF', () => {
      const validCPF = '87511948057';
      expect(isValidCPFOrCNPJ(validCPF)).toBe(true);
    });

    it('should return false for an invalid CPF', () => {
      const invalidCPF = '12345678901';
      expect(isValidCPFOrCNPJ(invalidCPF)).toBe(false);
    });

    it('should return false for a CPF with all identical digits', () => {
      const identicalDigitsCPF = '11111111111';
      expect(isValidCPFOrCNPJ(identicalDigitsCPF)).toBe(false);
    });
  });

  describe('CNPJ validation', () => {
    it('should return true for a valid CNPJ', () => {
      const validCNPJ = '15234772000165';
      expect(isValidCPFOrCNPJ(validCNPJ)).toBe(true);
    });

    it('should return false for an invalid CNPJ', () => {
      const invalidCNPJ = '12345678000199';
      expect(isValidCPFOrCNPJ(invalidCNPJ)).toBe(false);
    });

    it('should return false for a CNPJ with all identical digits', () => {
      const identicalDigitsCNPJ = '11111111111111';
      expect(isValidCPFOrCNPJ(identicalDigitsCNPJ)).toBe(false);
    });
  });

  describe('General validation', () => {
    it('should return false for a string with less than 11 digits', () => {
      const shortString = '123';
      expect(isValidCPFOrCNPJ(shortString)).toBe(false);
    });

    it('should return false for a string with more than 14 digits', () => {
      const longString = '123456789012345';
      expect(isValidCPFOrCNPJ(longString)).toBe(false);
    });

    it('should return false for a non-numeric string', () => {
      const nonNumeric = 'invalid_string';
      expect(isValidCPFOrCNPJ(nonNumeric)).toBe(false);
    });
  });
});
