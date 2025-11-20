import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sanitizeNumericInput = (value: string, integerLimit: number, decimalLimit: number) => {
    let clean = value.replace(/[^0-9,]/g, '');
    const parts = clean.split(',');
    if (parts.length > 2) {
      clean = parts[0] + ',' + parts.slice(1).join('');
    }
    
    const [integerPart, decimalPart] = clean.split(',');
    const limitedInteger = integerPart.slice(0, integerLimit);
    const limitedDecimal = decimalPart ? decimalPart.slice(0, decimalLimit) : '';

    if (decimalPart !== undefined) {
      return `${limitedInteger},${limitedDecimal}`;
    }
    return limitedInteger;
};

export const sanitizeAlphanumeric = (value: string) => {
    return value.replace(/[^A-Za-z0-9\s\/-]/g, '');
};

export const formatCurrency = (value: number = 0, withSymbol = true) => {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  if (withSymbol) {
    options.style = 'currency';
    options.currency = 'BRL';
  }
  return value.toLocaleString('pt-BR', options);
};

export const formatArea = (value: string | number) => {
  const num = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
  if (isNaN(num) || num === 0) return '0,000';
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
};