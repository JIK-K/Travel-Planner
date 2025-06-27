// TravelPlanner.tsx
import React, { useState } from "react";
import TripResultPanel from "./components/TripResultPanel";
import TripInputPanel from "./components/TripInputPanel";
import type { Person } from "./types/person.type";
import type { Trip } from "./types/trip.type";
import type { Calculated, CalculatedRowRaw } from "./types/calculated.type";

export default function TravelPlanner() {
  const [people, setPeople] = useState<Person[]>([
    { name: "", food: 0, transport: 0, stay: 0, fuel: 0, etc: 0 },
  ]);

  const [driverIndex, setDriverIndex] = useState<number | null>(0);

  const [trip, setTrip] = useState<Trip>({
    startDate: "",
    endDate: "",
    destination: "",
    accommodation: "",
    transportMethod: "대중교통",
  });

  const [calculated, setCalculated] = useState<Calculated | null>(null);

  const addPerson = () => {
    setPeople((prev) => [
      ...prev,
      { name: "", food: 0, transport: 0, stay: 0, fuel: 0, etc: 0 },
    ]);
  };

  const removePerson = (index: number) => {
    if (people.length <= 1) return;
    const newPeople = [...people];
    newPeople.splice(index, 1);
    setPeople(newPeople);
    if (driverIndex !== null && index === driverIndex) setDriverIndex(null);
  };

  const handlePersonChange = (
    index: number,
    key: keyof Person,
    value: string | number
  ) => {
    const newPeople = [...people];

    if (key === "name") {
      newPeople[index][key] = value as string;
    } else {
      newPeople[index][key] = Number(value) as any; // or use type assertion
    }

    setPeople(newPeople);
  };

  const handleTripChange = (key: keyof Trip, value: string) => {
    setTrip((prev) => ({ ...prev, [key]: value }));
    if (key === "transportMethod" && value === "대중교통") {
      setDriverIndex(null);
    } else if (
      key === "transportMethod" &&
      value === "자차" &&
      driverIndex === null
    ) {
      setDriverIndex(0);
    }
  };

  // 항목별로 분배하는 정산 매트릭스 계산 함수
  const calculateSettlementMatrixByItem = (
    people: Person[],
    trip: Trip,
    driverIndex: number | null
  ) => {
    const n = people.length;
    // const driver = driverIndex !== null ? people[driverIndex] : null;
    const matrix: number[][] = Array.from({ length: n }, () =>
      Array(n).fill(0)
    );

    // 항목별 분배 함수
    const distribute = (
      amounts: number[],
      perPerson: number[],
      payerIndices: number[]
    ) => {
      payerIndices.forEach((payerIdx) => {
        const paid = amounts[payerIdx];
        if (paid === 0) return;
        const numReceivers = perPerson.filter((share) => share > 0).length;
        perPerson.forEach((share, i) => {
          if (i === payerIdx || share === 0) return; // 운전자(share=0)에게는 분배하지 않음
          matrix[i][payerIdx] += paid / numReceivers;
        });
      });
    };

    // 식비, 교통비, 숙소비, 기타: n분의 1
    const foodAmounts = people.map((p) => p.food);
    const foodPerPerson = Array(n).fill(
      people.reduce((sum, p) => sum + p.food, 0) / n
    );
    distribute(
      foodAmounts,
      foodPerPerson,
      foodAmounts.map((_, idx) => idx)
    );

    const transportAmounts = people.map((p) => p.transport);
    const transportPerPerson = Array(n).fill(
      people.reduce((sum, p) => sum + p.transport, 0) / n
    );
    distribute(
      transportAmounts,
      transportPerPerson,
      transportAmounts.map((_, idx) => idx)
    );

    const stayAmounts = people.map((p) => p.stay);
    const stayPerPerson = Array(n).fill(
      people.reduce((sum, p) => sum + p.stay, 0) / n
    );
    distribute(
      stayAmounts,
      stayPerPerson,
      stayAmounts.map((_, idx) => idx)
    );

    const etcAmounts = people.map((p) => p.etc);
    const etcPerPerson = Array(n).fill(
      people.reduce((sum, p) => sum + p.etc, 0) / n
    );
    distribute(
      etcAmounts,
      etcPerPerson,
      etcAmounts.map((_, idx) => idx)
    );

    // 기름값: 운전자 제외 n-1분의 1
    if (trip.transportMethod === "자차" && driverIndex !== null) {
      const fuelAmounts = people.map((p) => p.fuel);
      const fuelPayers = people
        .map((_, i) => i)
        .filter((i) => i !== driverIndex);
      const totalFuel = people.reduce((sum, p) => sum + p.fuel, 0);
      const fuelPerPerson = totalFuel / fuelPayers.length;
      const fuelPerPersonArr = people.map((_, i) =>
        i !== driverIndex ? fuelPerPerson : 0
      );
      distribute(
        fuelAmounts,
        fuelPerPersonArr,
        fuelAmounts.map((_, idx) => idx)
      );
    }

    // 각 셀의 값을 정수로 변환
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        matrix[i][j] = Math.round(matrix[i][j]);
      }
    }
    return matrix;
  };

  const calculateCosts = (e: React.FormEvent) => {
    e.preventDefault();

    const totalPeople = people.length;
    const driver = driverIndex !== null ? people[driverIndex] : null;
    const driverName = driver?.name || "";

    const totalFuel =
      trip.transportMethod === "자차"
        ? people.reduce((sum, p) => sum + p.fuel, 0)
        : 0;

    // 기름값 분담 계산 (운전자 제외)
    const fuelPayers =
      trip.transportMethod === "자차" && driverIndex !== null
        ? people.filter((_, i) => i !== driverIndex)
        : [];

    const fuelPerPerson =
      fuelPayers.length > 0 ? totalFuel / fuelPayers.length : 0;

    // 실제 지출 금액을 계산 (기름값 분담 적용)
    const rows: CalculatedRowRaw[] = people.map((p, i) => {
      const isDriver = i === driverIndex;
      const fuelShare =
        trip.transportMethod === "자차" ? (isDriver ? 0 : fuelPerPerson) : 0;

      const actualPaid = p.food + p.transport + p.stay + p.etc + p.fuel;
      const effectivePaid = actualPaid - fuelShare; // 기름값 분담 차감

      return {
        name: p.name,
        food: p.food,
        transport: p.transport,
        stay: p.stay,
        etc: p.etc,
        fuel: p.fuel, // fuel 값을 명확히 포함
        fuelShare,
        total: effectivePaid, // 기름값 분담이 적용된 실제 부담 금액
      };
    });

    // 전체 비용 계산 (기름값 분담 적용된 총합)
    const totalSum = rows.reduce((acc, row) => acc + row.total, 0);
    const perPersonCost = totalSum / totalPeople;

    const settlementMatrix = calculateSettlementMatrixByItem(
      people,
      trip,
      driverIndex
    );

    setCalculated({
      driver: driverName,
      totalFuel: totalFuel.toFixed(0),
      rows: rows.map((r) => ({
        ...r,
        fuel: r.fuel, // fuel 값을 추가
        fuelShare: r.fuelShare.toFixed(0),
        total: r.total.toFixed(0),
      })),
      perPersonCost: perPersonCost.toFixed(0),
      settlements: [], // 사용하지 않음
      settlementMatrix,
      tripInfo: trip, // 여행 정보 추가
    });
  };

  return (
    <div className="flex max-w-[1200px] mx-auto px-8 py-6 gap-6 justify-center">
      <TripInputPanel
        trip={trip}
        people={people}
        driverIndex={driverIndex}
        handleTripChange={handleTripChange}
        handlePersonChange={handlePersonChange}
        addPerson={addPerson}
        removePerson={removePerson}
        setDriverIndex={setDriverIndex}
        calculateCosts={calculateCosts}
      />
      <TripResultPanel calculated={calculated} />
    </div>
  );
}
