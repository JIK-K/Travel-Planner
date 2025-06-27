import React from "react";
import type { Trip } from "../types/trip.type";
import type { Person } from "../types/person.type";

type TripInputPanelProps = {
  trip: Trip;
  people: Person[];
  driverIndex: number | null;
  handleTripChange: (key: keyof Trip, value: string) => void;
  handlePersonChange: (
    index: number,
    key: keyof Person,
    value: string | number
  ) => void;
  addPerson: () => void;
  removePerson: (index: number) => void;
  setDriverIndex: (index: number) => void;
  calculateCosts: (e: React.FormEvent) => void;
};

const TripInputPanel: React.FC<TripInputPanelProps> = ({
  trip,
  people,
  driverIndex,
  handleTripChange,
  handlePersonChange,
  addPerson,
  removePerson,
  setDriverIndex,
  calculateCosts,
}) => {
  return (
    <form
      onSubmit={calculateCosts}
      className="flex flex-col flex-1 overflow-auto border border-gray-300 rounded p-[16px] gap-[36px] w-screen"
    >
      <h1 className="text-[24px] font-semibold pb-[24px]">
        🗺️ 여행 계획표 입력
      </h1>

      <section className="flex flex-col">
        <h2 className="text-[18px] font-medium">📅 여행 기본 정보</h2>

        <div className="flex gap-[8px] items-center">
          출발:
          <input
            type="date"
            value={trip.startDate}
            required
            onChange={(e) => handleTripChange("startDate", e.target.value)}
            className="p-[8px] border border-gray-300 rounded"
          />
          도착:
          <input
            type="date"
            value={trip.endDate}
            required
            onChange={(e) => handleTripChange("endDate", e.target.value)}
            className="p-[8px] border border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col gap-[8px]">
          목적지:
          <input
            type="text"
            value={trip.destination}
            required
            onChange={(e) => handleTripChange("destination", e.target.value)}
            className="p-[8px] border border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col gap-[8px]">
          숙소 주소:
          <input
            type="text"
            value={trip.accommodation}
            required
            onChange={(e) => handleTripChange("accommodation", e.target.value)}
            className="p-[8px] border border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col gap-[8px]">
          이동 수단:
          <select
            value={trip.transportMethod}
            onChange={(e) =>
              handleTripChange("transportMethod", e.target.value)
            }
            className="p-[8px] border border-gray-300 rounded"
          >
            <option value="대중교통">대중교통</option>
            <option value="자차">자차</option>
          </select>
        </div>
      </section>

      <section className="flex flex-col">
        <h2 className="text-[18px] font-medium">👥 인원 및 비용</h2>
        <div className="flex items-center gap-[8px] pb-[12px]">
          <button
            type="button"
            onClick={addPerson}
            className="bg-[#c2e67c] text-white px-[12px] py-[6px]"
          >
            + 인원 추가
          </button>
          <span className="text-[16px]">총 인원: {people.length}명</span>
        </div>

        <div className="flex flex-col gap-[20px]">
          {people.map((person, index) => (
            <div
              key={index}
              className="flex flex-col p-[16px] border border-gray-300 rounded shadow-sm"
            >
              {people.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePerson(index)}
                  className="text-white rounded-[12px] text-center text-[16px] font-bold bg-[#c2e67c]"
                  title="인원 제거"
                >
                  삭제
                </button>
              )}

              <div className="flex flex-col gap-[8px]">
                <div className="flex flex-col w-full gap-[4px]">
                  이름:
                  <input
                    type="text"
                    value={person.name}
                    required
                    placeholder="홍길동"
                    onChange={(e) =>
                      handlePersonChange(index, "name", e.target.value)
                    }
                    className="p-[8px] border border-gray-300 rounded"
                  />
                </div>

                <div className="flex flex-col w-full gap-[4px]">
                  식비:
                  <input
                    value={person.food}
                    min={0}
                    onChange={(e) =>
                      handlePersonChange(index, "food", e.target.value)
                    }
                    className="p-[8px] border border-gray-300 rounded"
                  />
                </div>

                <div className="flex flex-col w-full gap-[4px]">
                  교통비:
                  <input
                    value={person.transport}
                    min={0}
                    onChange={(e) =>
                      handlePersonChange(index, "transport", e.target.value)
                    }
                    className="p-[8px] border border-gray-300 rounded"
                  />
                </div>

                <div className="flex flex-col w-full gap-[4px]">
                  숙소비:
                  <input
                    value={person.stay}
                    min={0}
                    onChange={(e) =>
                      handlePersonChange(index, "stay", e.target.value)
                    }
                    className="p-[8px] border border-gray-300 rounded"
                  />
                </div>

                <div className="flex flex-col w-full gap-[4px]">
                  기타 지출:
                  <input
                    value={person.etc}
                    min={0}
                    onChange={(e) =>
                      handlePersonChange(index, "etc", e.target.value)
                    }
                    className="p-[8px] border border-gray-300 rounded"
                  />
                </div>

                {/* 자차일 때만 기름값 입력 가능 */}
                {trip.transportMethod === "자차" && (
                  <div className="flex flex-col w-full gap-[4px]">
                    기름값:
                    <input
                      value={person.fuel}
                      min={0}
                      onChange={(e) =>
                        handlePersonChange(index, "fuel", e.target.value)
                      }
                      className="p-[8px] border border-gray-300 rounded"
                    />
                  </div>
                )}

                {/* 자차 선택 시에만 운전자 지정 체크박스 노출 */}
                {trip.transportMethod === "자차" && (
                  <div className="flex w-full gap-[4px]">
                    <input
                      type="checkbox"
                      name="driver"
                      checked={driverIndex === index}
                      onChange={() => setDriverIndex(index)}
                    />
                    <span>운전자 지정</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <button
        type="submit"
        className="bg-[#c2e67c] text-white py-[8px] px-[12px] rounded text-[16px]"
      >
        계산하기
      </button>
    </form>
  );
};

export default TripInputPanel;
