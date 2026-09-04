export interface CalculatorInput {
  area: number;
  layers: number;
  coverageRate: number;
  packagingVolume: number;
  price: number;
}

export interface CalculatorResult {
  requiredVolume: number;
  packages: number;
  totalVolume: number;
  cost: number;
}

const RESERVE_FACTOR = 1.1;

export function calculateMaterial(input: CalculatorInput): CalculatorResult {
  const { area, layers, coverageRate, packagingVolume, price } = input;

  if (!area || area <= 0 || !coverageRate || coverageRate <= 0 || !packagingVolume || packagingVolume <= 0) {
    return { requiredVolume: 0, packages: 0, totalVolume: 0, cost: 0 };
  }

  const requiredVolume =
    Math.round(((area * layers) / coverageRate) * RESERVE_FACTOR * 10) / 10;
  const packages = Math.ceil(requiredVolume / packagingVolume);
  const totalVolume = Math.round(packages * packagingVolume * 10) / 10;

  return {
    requiredVolume,
    packages,
    totalVolume,
    cost: packages * price,
  };
}
