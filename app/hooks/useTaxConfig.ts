import { useState, useMemo } from 'react';
import type { TaxType } from '@components';
import type { TaxConfig } from '@/utils/billCalculation';
import { validateTaxInput } from '@utils';

type UseTaxConfigOptions = {
  billAmount: number;
  showTaxInput: boolean;
};

export type UseTaxConfigReturn = {
  taxType: TaxType;
  setTaxType: (type: TaxType) => void;
  taxValue: string;
  setTaxValue: (value: string) => void;
  taxConfig: TaxConfig | undefined;
};

/**
 * Owns tax input state and derives a validated TaxConfig from it.
 *
 * The hook is the single seam between user input (taxType, taxValue)
 * and the calculator's TaxConfig contract. HomeTipScreen no longer
 * needs to know how validation or config-building work.
 */
export const useTaxConfig = ({
  billAmount,
  showTaxInput,
}: UseTaxConfigOptions): UseTaxConfigReturn => {
  const [taxType, setTaxType] = useState<TaxType>('percentage');
  const [taxValue, setTaxValue] = useState<string>('');

  const taxConfig = useMemo<TaxConfig | undefined>(() => {
    const numericTaxValue = parseFloat(taxValue);
    const { isValid } = validateTaxInput(taxValue, taxType, String(billAmount));
    if (showTaxInput && !isNaN(numericTaxValue) && numericTaxValue > 0 && isValid) {
      return { mode: 'before', type: taxType, value: numericTaxValue };
    }
    return undefined;
  }, [showTaxInput, taxType, taxValue, billAmount]);

  return { taxType, setTaxType, taxValue, setTaxValue, taxConfig };
};
