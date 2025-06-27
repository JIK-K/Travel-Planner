import React from "react";
import type { Calculated } from "../types/calculated.type";

type TripResultPanelProps = {
  calculated: Calculated | null;
};

function formatNumber(num: string | number) {
  return Number(num).toLocaleString();
}

const TripResultPanel: React.FC<TripResultPanelProps> = ({ calculated }) => {
  if (!calculated) {
    return (
      <section className="flex flex-col flex-1 border border-gray-300 rounded p-[16px] gap-[24px]">
        <h2 className="text-xl font-semibold mb-[12px]">💰 계산 결과</h2>
        <p className="text-gray-500">
          계산 결과가 아직 없습니다. 왼쪽에서 정보를 입력하고 "계산하기"를
          눌러보세요.
        </p>
      </section>
    );
  }

  const { driver, rows, settlementMatrix } = calculated;

  const names = rows.map((r) => r.name);

  // 여행 기본 정보 표시
  const tripInfo = calculated.tripInfo;

  return (
    <section className="flex flex-col flex-1 border border-gray-300 rounded p-[16px] gap-[24px] overflow-auto">
      <h2 className="text-xl font-semibold mb-[12px]">💰 계산 결과</h2>
      {/* 여행 기본 정보 */}
      <div className="flex flex-col gap-[8px]">
        {tripInfo && (
          <div className="text-[14px]">
            <div>출발일: {tripInfo.startDate}</div>
            <div>도착일: {tripInfo.endDate}</div>
            <div>목적지: {tripInfo.destination}</div>
            <div>숙소: {tripInfo.accommodation}</div>
            <div>이동수단: {tripInfo.transportMethod}</div>
          </div>
        )}
        <p>
          운전자:{" "}
          <span className="text-[14px] font-bold"> {driver || "없음"}</span>
        </p>
      </div>
      {/* 각 사람별 지출 테이블 */}
      <div>
        <h3 className="font-semibold mb-[8px]">📊 각 사람별 지출</h3>
        <table className="w-full text-left border-collapse mb-[24px]">
          <thead>
            <tr>
              <th className="border-b border-gray-400 p-[8px]">이름</th>
              <th className="border-b border-gray-400 p-[8px]">식비</th>
              <th className="border-b border-gray-400 p-[8px]">교통비</th>
              <th className="border-b border-gray-400 p-[8px]">숙소비</th>
              <th className="border-b border-gray-400 p-[8px]">기름값</th>
              <th className="border-b border-gray-400 p-[8px]">기타</th>
              <th className="border-b border-gray-400 p-[8px]">합계</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const sum =
                row.food + row.transport + row.stay + row.fuel + row.etc;
              return (
                <tr key={row.name} className="text-[12px]">
                  <td className="border-b border-gray-300 p-[8px]">
                    {row.name}
                  </td>
                  <td className="border-b border-gray-300 p-[8px]">
                    {formatNumber(row.food)}
                  </td>
                  <td className="border-b border-gray-300 p-[8px]">
                    {formatNumber(row.transport)}
                  </td>
                  <td className="border-b border-gray-300 p-[8px]">
                    {formatNumber(row.stay)}
                  </td>
                  <td className="border-b border-gray-300 p-[8px]">
                    {formatNumber(row.fuel)}
                  </td>
                  <td className="border-b border-gray-300 p-[8px]">
                    {formatNumber(row.etc)}
                  </td>
                  <td className="border-b border-gray-300 p-[8px] font-semibold">
                    {formatNumber(sum)} 원
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* 정산 내역 (누가 누구에게 얼마를) */}
      <div>
        <h3 className="font-semibold mb-[8px]">
          🔄 정산 내역 (누가 누구에게 얼마를)
        </h3>
        <table className="w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="border-b border-gray-400 p-[8px]">이름</th>
              {names.map((name) => (
                <th key={name} className="border-b border-gray-400 p-[8px]">
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {settlementMatrix.map((row, i) => (
              <tr key={names[i]}>
                <th className="border-b border-gray-400 p-[8px]">{names[i]}</th>
                {row.map((amount, j) => (
                  <td
                    key={j}
                    className="border-b border-gray-300 p-[8px] text-right"
                  >
                    {amount > 0 ? `${formatNumber(amount)} 원` : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TripResultPanel;
