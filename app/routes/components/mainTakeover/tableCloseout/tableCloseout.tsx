import { useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";
import dayjs from "dayjs";
import { appStateAtom, isSavingAtom, mainTakoverAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles, formFieldStyles, formSelectStyles, optionStyles, ROW } from "~/util/GlobalStylesUtil";
import { DAYJS_DATE_FORMAT, Helpers, type TimeElapsed } from "~/util/Helpers";
import ModalConfirm from "../../ui-components/modal/modalConfirm";
import { fragmentExitTakeover, fragmentUsageIndicator } from "../../fragments/fragments";
import { DEFAULT_ID, DefaultTableRateData, WEEK_DAYS, type BillableData, type BillablePlayer, type ExtraPlayer, type Guest, type MeteredTime, type PlayerRateRules, type ScheduleEntry, type TableItem, type TableRate, type TableRateRules } from "~/config/AppState";

export default function TableCloseout() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [, setSelectedTable] = useAtom(selectedTableAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);
  const [, setSaving] = useAtom(isSavingAtom);
  const [, setElapsedTime] = useState<TimeElapsed>({} as TimeElapsed);
  const [SHOW_CONFIRM_CLOSEOUT, setShowConfirmCloseout] = useState(false);
  const [TABLE_HOURS, setTableHours] = useState('');
  const [SELECTED_RATE, setSelectedRate] = useState<TableRate>(DefaultTableRateData);
  const [SELECTED_DAY, setSelectedDay] = useState<number>(dayjs().day());
  const [BILLABLE_DATA, setBillableData] = useState<BillableData>({} as BillableData);

  const playerOrTableTimeStyles = `hover:cursor-pointer ring-1 rounded-full px-2 text-gray-500 ring-gray-800`;
  const playerOrTableTimeSelectedStyles = `bg-green-500 !text-black`;

  const TopRef = useRef<HTMLDivElement>(null);

  const exit = () => {
    MAIN_TAKEOVER.closeoutTable.guest.closedOutAt = 0;
    setMainTakeover(undefined);
  }

  const setupBillablePlayers = () => {
    if (!SELECTED_RATE.id) return;

    const table: TableItem = MAIN_TAKEOVER.closeoutTable;
    const guest: Guest = table.guest;

    const businessDayOffsetHours = APP_STATE.businessDayOffsetHours;
    const assignedAt = table.guest.assignedAt;

    // Use local time from the browser, not server.
    // See assignTable.tsx and assignGuestService.server.ts
    setSelectedDay(dayjs(new Date(assignedAt)).subtract(businessDayOffsetHours, 'hour').day());

    const playerRateRules: PlayerRateRules = SELECTED_RATE.playerRateRules;
    const tableRateRules: TableRateRules = SELECTED_RATE.tableRateRules;

    const useRateSchedule = tableRateRules.useRateSchedule;
    const schedule = useRateSchedule && Helpers.getRateSchedule(APP_STATE, tableRateRules.rateScheduleId);
    const daySchedule: ScheduleEntry = schedule && schedule.entries[WEEK_DAYS[SELECTED_DAY]];

    const start = guest.assignedAt;
    const end = guest.closedOutAt;
    const time: TimeElapsed = Helpers.timeElapsed(start, end);
    const hours = (tableRateRules.isOneHourMinimum && (time.hoursExact < 1 )) ? `1.000` : time.durationHoursDecimal3;

    const hourlyRate = tableRateRules.hourlyRate;
    const isChargePerPlayer = tableRateRules.isChargePerPlayer;
    const playerLimit = playerRateRules.playerLimit;
    const afterLimitRate = playerRateRules.afterLimitRate;

    const PLAYERS_COUNT = isChargePerPlayer ? Math.max(guest.partySize, guest.extraPlayers.length + 1) : 1;
    const players: BillablePlayer[] = [];

    for (let i = 0; i < (PLAYERS_COUNT); i++) {
      const rate = (isChargePerPlayer && (i >= playerLimit)) ? afterLimitRate : hourlyRate;

      players.push({
        id: i,
        name: `Player ${i + 1}`,
        hours,
        rate,
        daySchedule,
        billable: true,
        isAddedPlayer: false,
        usePlayerTime: false,
        assignedAt: guest.assignedAt,
      } as BillablePlayer);
    }
    players[0].name = guest.name.toUpperCase();

    guest.extraPlayers.forEach((player: ExtraPlayer, index) => {
      const playersIndex = index + 1;
      if (playersIndex > players.length - 1) return;
      players[playersIndex].name = player.name.toUpperCase();
      players[playersIndex].isAddedPlayer = true;
      players[playersIndex].usePlayerTime = true;
      players[playersIndex].assignedAt = player.assignedAt;

      // NOTE: Added Players:  Player-Assignment TIME !== Table-Assignment TIME
      const time = Helpers.timeElapsed(player.assignedAt, guest.closedOutAt);
      const hours = (tableRateRules.isOneHourMinimum && (time.hoursExact < 1 )) ? `1.000` : time.durationHoursDecimal3;
      players[playersIndex].hours = hours;
    });

    setBillableData({players});
  }

  const getPlayerHours = (player: BillablePlayer, guest: Guest) => {
    const time = Helpers.timeElapsed(player.assignedAt, guest.closedOutAt);
    const hours = (SELECTED_RATE.tableRateRules.isOneHourMinimum && (time.hoursExact < 1 )) ? `1.000` : time.durationHoursDecimal3;
    return hours;
  }

  const onChangeTableRate = (event) => {
    const selectedRate: TableRate = APP_STATE.tableRates.find((rate) => rate.id === Number(event.target.value));
    setSelectedRate(selectedRate);
    const players: BillablePlayer[] = BILLABLE_DATA.players.map((player) => {
      player.rate = selectedRate.tableRateRules.hourlyRate;
      return player;
    });
    useTableHours(TABLE_HOURS);
    setBillableData({...BILLABLE_DATA, players});
  }

  const useTableHours = (hours: string) => {
    BILLABLE_DATA.players.forEach((player) => {
      player.hours = player.usePlayerTime ? getPlayerHours(player, MAIN_TAKEOVER.closeoutTable.guest) : hours;
    })
    setBillableData({...BILLABLE_DATA});
  }

  const playersTotal = () => {
    let total = 0;
    BILLABLE_DATA.players?.forEach((player) => {
      if (player.billable) {
        const playerHours = player.isAddedPlayer && player.usePlayerTime ? player.hours : TABLE_HOURS;
        const hours = SELECTED_RATE.tableRateRules.isFlatRate ? 1 : Number(playerHours);
        total += hours * Number(player.rate);
      }
    })
    return total.toFixed(2);
  }

  const playerAssignedAt = (player: BillablePlayer, index: number) => {
    const guest: Guest = MAIN_TAKEOVER.closeoutTable.guest;
    const assignedAt = !index ? guest.assignedAt : ((guest.extraPlayers[index - 1]?.assignedAt) || guest.assignedAt);
    return dayjs(new Date(assignedAt)).format(DAYJS_DATE_FORMAT);
  }

  const usePlayerTime = (player: BillablePlayer, which: boolean) =>{
    if (which === player.usePlayerTime) return;
    player.usePlayerTime = which;
    player.hours = which ? getPlayerHours(player, MAIN_TAKEOVER.closeoutTable.guest) : TABLE_HOURS;
    setBillableData({...BILLABLE_DATA});
  }

  const onClickReset = () => {
    const table: TableItem = MAIN_TAKEOVER.closeoutTable;
    const guest: Guest = table.guest;
    const start = guest.assignedAt;
    const end = guest.closedOutAt;
    const hours = Helpers.timeElapsed(start, end);
    setElapsedTime(hours);
    setTableHours(`${hours.durationHoursDecimal3}`);
    resetTableRate();
  }

  const resetTableRate = () => {
    const table: TableItem = MAIN_TAKEOVER.closeoutTable;
    const guest = table.guest;
    const usageType = Helpers.getUsageType(APP_STATE, guest.usageTypeId);
    const tableTypeId = table.tableTypeId;
    const tableType = APP_STATE.tableTypes.find((type) => type.id === tableTypeId);

    let tableRate: TableRate = APP_STATE.tableRates.find((rate) => (rate.id === tableType.tableRateId) && rate.isActive);

    if (table.ignoreTableTypeRate) {
      tableRate = APP_STATE.tableRates.find((rate) => (rate.id === table.tableRateId) && rate.isActive);
    }

    if (guest.usageTypeId !== DEFAULT_ID) {
      if (usageType) {
        tableRate = APP_STATE.tableRates.find((rate) => (rate.id === usageType.tableRateId) && rate.isActive);
      }
    }

    if (!tableRate) {
      tableRate = APP_STATE.tableRates[0];
    }
    setSelectedRate(tableRate);
  }

  const onClickFinalConfirm = async () => {
    setSaving(true);
    const newAppState = await AppStorage.deleteGuestRemote(MAIN_TAKEOVER.closeoutTable.guest.id);
    setSaving(false);
    setAppState(newAppState);
    setSelectedTable(undefined);
    setMainTakeover(undefined);
  }

  const fragmentTableRate = () => {
    return (
      <div className="mt-1">
        <div>
          <select
            onChange={onChangeTableRate}
            value={SELECTED_RATE.id}
            className={`${formSelectStyles} text-center !text-base`}
          >
            {APP_STATE.tableRates
              .filter((tableRate) => tableRate.isActive)
              .map((tableRate) => (
                <option key={tableRate.id} className={`${optionStyles} text-center`} value={tableRate.id}>{tableRate.name} {Helpers.tableRateSuffix(tableRate)}</option>
              ))
            }
          </select>
        </div>
        <div className="text-sm text-gray-500 mt-1 italic">
          (S) = Single Player, (F) = Flat Rate
        </div>
      </div>
    )
  }

  const fragmentUsageType = () => {
    const guest = MAIN_TAKEOVER.closeoutTable.guest;
    const usageType = Helpers.getUsageType(APP_STATE, guest.usageTypeId);
    return fragmentUsageIndicator(usageType);
  }

  const fragmentFormHeader = () => {
    return (
      !SELECTED_RATE.tableRateRules.isFlatRate && (
        <div className="text-gray-400 mt-5">
          <div className="flex items-center justify-center gap-2">
            <span className="text-green-500 text-2xl">{MAIN_TAKEOVER.closeoutTable.name}</span>
            <span className="text-gray-600 text-base ml-1"> WORKSHEET </span>
            {fragmentUsageType()}
          </div>
          <div className="mb-3 text-gray-300 italic">
            <span className="text-gray-500">Assigned: </span>{dayjs(new Date(MAIN_TAKEOVER.closeoutTable.guest.assignedAt)).format(DAYJS_DATE_FORMAT)}
          </div>
          <div className="inline-block text-right">
            <div className="TIME flex items-center">
              <div className="inline-block shrink">
                <input
                  type="text"
                  className={`text-gray-500 w-[100px] !text-center !text-lg ${formFieldStyles}`}
                  maxLength={6}
                  value={TABLE_HOURS}
                  onChange={(event) => {
                    const hours = event.target.value.trim()
                    setTableHours(hours);
                    useTableHours(hours);
                  }}
                />
              </div>
              <div className="ml-2 text-center text-gray-500">
                hrs
              </div>
            </div>
          </div>
        </div>
      )
    )
  }

  const fragmentFormActionButtons = () => {
    return (
      <div className="my-3 mb-10">
        <button className={`${actionButtonStyles} mx-2`} onClick={onClickReset}>Reset</button>
        <button className={`${actionButtonStyles} mx-2`} onClick={() => {setShowConfirmCloseout(true)}}>Close Out {MAIN_TAKEOVER.closeoutTable.name}</button>
      </div>
    )
  }

  const fragmentBillableData = () => {
    return (<>
      <div className="WORKSHEET mt-2 text-left ">
        {BILLABLE_DATA.players?.map((player, index) => (<div key={player.id}>
          <div key={player.id} className={`PLAYER mb-2 p-4 border ${player.billable? 'border-green-800' : 'border-dashed border-gray-500 opacity-50'} rounded-xl`}>
            <div className="flex">
              <div className="shrink">
                <input
                  type="checkbox"
                  className="hover:cursor-pointer"
                  checked={player.billable}
                  onChange={(event) => {
                    player.billable = event.target.checked;
                    setBillableData({...BILLABLE_DATA});
                  }}
                />
              </div>
              <div className={`${!player.billable && 'pointer-events-none'}`}>
                <div className="text-center">
                  <div className={`inline-block text-base ${(index > MAIN_TAKEOVER.closeoutTable.guest.extraPlayers.length) ? 'text-gray-300 italic' : 'text-green-700'}`}>
                    {player.name}
                    {index === 0 && (
                      <div className="inline-block">&nbsp; (Main)</div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500 text-center">
                  {playerAssignedAt(player, index)}
                </div>
                {!SELECTED_RATE.tableRateRules.isFlatRate && (<>
                  <div className="text-sm mt-2 text-center">
                    <div className="px-1 inline-block">
                      <div className="text-sm text-gray-500 w-[90px] text-center">HOURS</div>
                      <input
                        type="text"
                        className={`w-[90px] !text-center ${formFieldStyles}`}
                        onChange={(event) => {
                          player.hours = event.target.value;
                          setBillableData({...BILLABLE_DATA});
                        }}
                        value={`${player.hours}`}
                      />
                    </div>
                    <div className="px-1 inline-block">
                      <div className="text-sm text-gray-500 w-[90px] text-center">RATE</div>
                      <input
                        type="text"
                        className={`w-[90px] !text-center ${formFieldStyles}`}
                        maxLength={6}
                        onChange={(event) => {
                          player.rate = event.target.value;
                          setBillableData({...BILLABLE_DATA});
                        }}
                        value={`${player.rate}`}
                      />
                    </div>
                  </div>
                  {player.isAddedPlayer && (<>
                    <div className="flex shrink gap-2 text-xs items-center my-2 justify-center">
                      <div className={`${playerOrTableTimeStyles} ${player.usePlayerTime && `!bg-blue-400 ${playerOrTableTimeSelectedStyles}`}`}
                        onClick={() => {usePlayerTime(player, true)}}
                      >
                        Player Time
                      </div>
                      <div> OR </div>
                      <div className={`${playerOrTableTimeStyles} ${!player.usePlayerTime && playerOrTableTimeSelectedStyles}`}
                        onClick={() => {usePlayerTime(player, false)}}
                      >
                        Table Time
                      </div>
                    </div>
                  </>)}

                  <div className="text-center text-xl text-green-500 mt-2">
                    ${(Number(player.hours) * Number(player.rate)).toFixed(2)}
                    <span className="!text-gray-500 ml-2 text-base"> / ${playersTotal()}</span>
                  </div>
                </>)}
                {SELECTED_RATE.tableRateRules.isFlatRate && (
                  <div className="text-center text-xl my-2 text-green-500">
                    ${Number(player.rate).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {SELECTED_RATE.tableRateRules.isChargePerPlayer && (index+1 === SELECTED_RATE.playerRateRules.playerLimit)  && (<>
            <div className="mb-3 text-center text-sm text-gray-500 py-2 italic">
              Base Rate Player Limit: {SELECTED_RATE.playerRateRules.playerLimit}
            </div>
          </>)}
        </div>))}
      </div>
      <div className="text-xl text-gray-400 my-5">
        Bill Total: &nbsp;
        <span className="text-green-500 text-xl">${playersTotal()}</span>
      </div>
    </>)
  }

  const fragmentBusinessDay = () => {
    return (<>
      <div className={`${ROW} items-center justify-center my-2`}>
          <div className={`text-gray-500 mr-1`}>
            Business Day
          </div>
          <select
            className={`${formSelectStyles} text-center cursor-pointer`}
            value={SELECTED_DAY}
            onChange={(event) => {
              setSelectedDay(Number(event.target.value));
            }}
            >
              {WEEK_DAYS.map((day, index) => {
                return (
                  <option key={index} value={index} className={`${optionStyles} text-center`}>{day}</option>
                )
              })}
          </select>
      </div>
    </>)
  }

  const fragmentModalConfirm = () => {
    return (
      <ModalConfirm
        show={SHOW_CONFIRM_CLOSEOUT}
        dialogTitle={`CLOSE OUT ${MAIN_TAKEOVER.closeoutTable.name}`}
        dialogMessageFn={() => <div className="text-base">
          <div className="mt-3 text-xl text-sky-500">{MAIN_TAKEOVER.closeoutTable.guest.name.toUpperCase()}</div>
          <div className="mt-2 text-2xl">Total: <span className="text-green-500">${playersTotal()}</span></div>
        </div>}
        onConfirm={onClickFinalConfirm}
        onCancel={() => {setShowConfirmCloseout(false)}}
      />
    )
  }

  useEffect(() => {
    setupBillablePlayers();
  }, [SELECTED_RATE]);

  useEffect(() => {
    onClickReset();
    TopRef.current && TopRef.current.scrollIntoView();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center text-center bg-black border-white select-none" ref={TopRef}>
      {fragmentExitTakeover(exit)}
      <div className="CONTENT flex-1 text-center">
        {fragmentFormHeader()}
        {fragmentTableRate()}
        {fragmentBusinessDay()}
        {fragmentBillableData()}
        {fragmentFormActionButtons()}
      </div>
      {fragmentModalConfirm()}
    </div>
  );
}
