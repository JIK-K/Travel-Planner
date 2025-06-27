// types/calculated.type.ts

import type { Trip } from "./trip.type";

// 계산 중간 단계에서 사용 (숫자 기반)
export type CalculatedRowRaw = {
  name: string;
  food: number;
  transport: number;
  stay: number;
  etc: number;
  fuel: number;
  fuelShare: number;
  total: number;
};

// 최종 표시용 (문자열로 toFixed 처리)
export type CalculatedRow = {
  name: string;
  food: number;
  transport: number;
  stay: number;
  etc: number;
  fuel: number;
  fuelShare: string;
  total: string;
};

export type Settlement = {
  name: string;
  settlement: string;
};

export type Calculated = {
  driver: string;
  totalFuel: string;
  rows: CalculatedRow[];
  perPersonCost: string;
  settlements: Settlement[];
  settlementMatrix: number[][];
  tripInfo?: Trip;
};
