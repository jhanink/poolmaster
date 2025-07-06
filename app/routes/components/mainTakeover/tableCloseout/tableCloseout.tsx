import { useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";
import dayjs from "dayjs";
import { appStateAtom, isSavingAtom, mainTakoverAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles, formFieldStyles, formSelectStyles, optionStyles, ROW, separatorBarStyles } from "~/util/GlobalStylesUtil";
import { DAYJS_DATE_FORMAT, Helpers, type TimeElapsed } from "~/util/Helpers";
import ModalConfirm from "../../ui-components/modal/modalConfirm";
import { fragmentExitTakeover, fragmentUsageIndicator } from "../../fragments/fragments";
import { DEFAULT_ID, DefaultTableRateData, WEEK_DAYS, type BillablePlayer, type Guest, type RateSchedule,type TableItem, type TableRate } from "~/config/AppState";

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
  const [BILLABLE_PLAYERS, setBillablePlayers] = useState<BillablePlayer[]>([]);
  const [SCHEDULE, setSchedule] = useState<RateSchedule>(undefined);
  const [METERED_DAY, setMeteredDay] = useState<any>({})

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
    const assignedAt = table.guest.assignedAt;
    const rules = SELECTED_RATE.tableRateRules;
    const useSchedule = rules.useRateSchedule;
    const scheduleId =  rules.rateScheduleId;
    const schedule = useSchedule && Helpers.getRateSchedule(APP_STATE, scheduleId);
    schedule && setSchedule(schedule);

    // Use local browser time instead of server time (TZ always current, no conversions needed)
    setSelectedDay(Helpers.getBusinessDay(APP_STATE, assignedAt));

    const players: BillablePlayer[] = Helpers.getBillablePlayers(APP_STATE, table, SELECTED_DAY, SELECTED_RATE)
    setBillablePlayers([...players]);
  }

  const getPlayerHours = (player: BillablePlayer, guest: Guest) => {
    const time = Helpers.timeElapsed(player.assignedAt, guest.closedOutAt);
    const hours = (SELECTED_RATE.tableRateRules.isOneHourMinimum && (time.hoursExact < 1 )) ? `1.000` : time.durationHoursDecimal3;
    return hours;
  }

  const onChangeTableRate = (event) => {
    const selectedRate: TableRate = APP_STATE.tableRates.find((rate) => rate.id === Number(event.target.value));
    setSelectedRate(selectedRate);
    BILLABLE_PLAYERS.map((player) => {
      player.rate = selectedRate.tableRateRules.hourlyRate;
      return player;
    });
    useTableHours(TABLE_HOURS);
    setBillablePlayers([...BILLABLE_PLAYERS]);
  }

  const useTableHours = (hours: string) => {
    BILLABLE_PLAYERS.forEach((player) => {
      player.hours = player.usePlayerTime ? getPlayerHours(player, MAIN_TAKEOVER.closeoutTable.guest) : hours;
    })
    setBillablePlayers([...BILLABLE_PLAYERS]);
  }

  const getMeterTotal = (player: BillablePlayer) => {
    const before = player.meteredDay.before
    const during = player.meteredDay.during
    const after = player.meteredDay.after
    const total = (before && Number(before.hours) * Number(before.rate) || 0)
      + (during && Number(during.hours) * Number(during.rate) || 0)
      + (after && Number(after.hours) * Number(after.rate) || 0);
    return total;
  }

  const getPlayerTotal = (player: BillablePlayer) => {
    if (SCHEDULE) {
      const totalHours = Number(player.hours);
      if (totalHours <= 1) {
        return Number(player.meteredDay.rate1hrMin);
      }
      return getMeterTotal(player);
    }

    const playerHours = SELECTED_RATE.tableRateRules.isFlatRate ? 1 : Number(player.hours);
    const adjustedPlayerHours = (SELECTED_RATE.tableRateRules.isOneHourMinimum && (playerHours < 1 )) ? 1 : playerHours;
    const playerRate = Number(player.rate);
    return adjustedPlayerHours * playerRate;
  }

  const playersRunningTotal = (includeClosedPlayer = false) => {
    let total = 0;
    BILLABLE_PLAYERS.forEach((player) => {
      if (includeClosedPlayer || player.billable) {
        total += getPlayerTotal(player);
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
    setBillablePlayers([...BILLABLE_PLAYERS]);
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
    return (<>
      <div>
        <select
          onChange={onChangeTableRate}
          value={SELECTED_RATE.id}
          className={`${formSelectStyles} text-center !text-xs `}
        >
          {APP_STATE.tableRates
            .filter((tableRate) => tableRate.isActive)
            .map((tableRate) => (
              <option key={tableRate.id} className={`${optionStyles} text-center`} value={tableRate.id}>{tableRate.name} {Helpers.tableRateSuffix(tableRate)}</option>
            ))
          }
        </select>
      </div>
      <div className="text-xs text-gray-500 mt-1 italic">
        (S) = Single Player, (F) = Flat Rate
      </div>
    </>)
  }

  const fragmentUsageType = () => {
    const guest = MAIN_TAKEOVER.closeoutTable.guest;
    const usageType = Helpers.getUsageType(APP_STATE, guest.usageTypeId);
    return fragmentUsageIndicator(usageType);
  }

  const fragmentFormHeader = () => {
    return (
        <div className="text-gray-400 mt-5">
          <div className="flex items-center justify-center">
            <div className="text-green-500 text-2xl border-r border-r-gray-700 pr-2 mr-2">{MAIN_TAKEOVER.closeoutTable.name}</div>
            <div className="text-gray-600 text-xs">
              CLOSEOUT
              <br/>
              <span className="text-gray-400">WORKSHEET</span>
            </div>
          </div>
          <hr className={`${separatorBarStyles} !border-t-gray-800 my-3`}/>
          <div className="my-2 text-sm text-gray-300 italic">
            <span className="text-gray-500">Assigned: </span>{dayjs(new Date(MAIN_TAKEOVER.closeoutTable.guest.assignedAt)).format(DAYJS_DATE_FORMAT)}
          </div>
          {!SELECTED_RATE.tableRateRules.isFlatRate && (
            <div className="inline-block text-right">
              <div className="text-center text-gray-500 text-xs">
                HOURS
              </div>
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
              </div>
            </div>
          )}
        </div>
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

  const showMeteredPeriod = (period) => {
    return period && Number(period.hours) > 0 && !!Number(period.rate);
  }

  const fragmentBillablePlayers = () => {
    return (<>
      <div className="WORKSHEET mt-2 text-left ">
        {BILLABLE_PLAYERS?.map((player, index) => (<div key={player.id}>
          <div key={player.id} className={`PLAYER mb-2 p-4 border ${player.billable? 'border-green-800' : 'border-dashed border-gray-500 opacity-50'} rounded-xl`}>
            <div className="flex">
              <div className="shrink">
                <input
                  type="checkbox"
                  className="hover:cursor-pointer size-4 mt-1"
                  checked={player.billable}
                  onChange={(event) => {
                    player.billable = event.target.checked;
                    setBillablePlayers([...BILLABLE_PLAYERS]);
                  }}
                />
              </div>

              <div className={`${!player.billable && 'pointer-events-none'}`}>
                <div className="text-center">
                  <div className={`inline-block text-base ${(index > MAIN_TAKEOVER.closeoutTable.guest.extraPlayers.length) ? 'text-gray-300 italic' : 'text-green-700'}`}>
                    {(index >  MAIN_TAKEOVER.closeoutTable.guest.extraPlayers.length) ? (
                      <span>- {player.name} -</span>
                    ) : (
                      <span>{player.name}</span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {playerAssignedAt(player, index)}
                </div>

                <div className="text-sm mt-2 text-center w-[200px]">
                  {!SELECTED_RATE.tableRateRules.isFlatRate && (<>
                    {SCHEDULE ? (<>
                    {['before', 'during', 'after'].map((period) => {
                      return showMeteredPeriod(METERED_DAY[period]) &&  (
                        <div>
                          <div className="px-1 inline-block">
                            <div className="text-xs text-gray-500 w-[90px] text-center">HOURS</div>
                            <input
                              type="text"
                              className={`w-[90px] !text-center ${formFieldStyles}`}
                              onChange={(event) => {
                                player.meteredDay[period].hours = event.target.value;
                                setBillablePlayers([...BILLABLE_PLAYERS]);
                              }}
                              value={`${player.meteredDay[period].hours}`}
                            />
                          </div>
                          <div className="px-1 inline-block">
                            <div className="text-xs text-gray-500 w-[90px] text-center">RATE</div>
                            <input
                              type="text"
                              className={`w-[90px] !text-center ${formFieldStyles}`}
                              maxLength={6}
                              onChange={(event) => {
                                player.meteredDay[period].rate = event.target.value;
                                setBillablePlayers([...BILLABLE_PLAYERS]);
                              }}
                              value={`${player.meteredDay[period].rate}`}
                            />
                          </div>
                        </div>
                      )
                    })}
                    </>) : (<>
                      <div className="px-1 inline-block">
                        <div className="text-xs text-gray-500 w-[90px] text-center">HOURS</div>
                        <input
                          type="text"
                          className={`w-[90px] !text-center ${formFieldStyles}`}
                          onChange={(event) => {
                            player.hours = event.target.value;
                            setBillablePlayers([...BILLABLE_PLAYERS]);
                          }}
                          value={`${player.hours}`}
                        />
                      </div>
                      <div className="px-1 inline-block">
                        <div className="text-xs text-gray-500 w-[90px] text-center">RATE</div>
                        <input
                          type="text"
                          className={`w-[90px] !text-center ${formFieldStyles}`}
                          maxLength={6}
                          onChange={(event) => {
                            player.rate = event.target.value;
                            setBillablePlayers([...BILLABLE_PLAYERS]);
                          }}
                          value={`${player.rate}`}
                        />
                      </div>
                    </>)}
                  </>)}
                </div>

                {!SELECTED_RATE.tableRateRules.isFlatRate && (<>
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
                </>)}

                <div className="text-center text-xl text-green-500 mt-2">
                  ${getPlayerTotal(player).toFixed(2)}
                  <span className="!text-gray-500 ml-2 text-base"> / ${playersRunningTotal(true)}</span>
                </div>

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
      <div className="text-lg text-gray-400 my-5">
        Running Total: &nbsp;
        <span className="text-green-500 text-xl">${playersRunningTotal()}</span>
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
          <div className="mt-2 text-2xl">Total: <span className="text-green-500">${playersRunningTotal()}</span></div>
        </div>}
        onConfirm={onClickFinalConfirm}
        onCancel={() => {setShowConfirmCloseout(false)}}
      />
    )
  }

  const fragmentRateSchedule = () =>  {
    return (<>
      {SCHEDULE && (
        <div className="inline-block mx-auto text-gray-500 my-2 px-3 py-1 border rounded-lg border-gray-800">
          <div className="text-xs">Schedule:</div>
          <div className="text-gray-100">{SCHEDULE.name}</div>
        </div>
      )}
    </>)
  }

  useEffect(() => {
    setupBillablePlayers();
    const table: TableItem = MAIN_TAKEOVER.closeoutTable;
    const guest = table.guest;
    const md = Helpers.getMeteredDay(APP_STATE, SELECTED_RATE, guest);
    setMeteredDay(md);
  }, [SELECTED_DAY, SELECTED_RATE]);

  useEffect(() => {
    onClickReset();
    TopRef.current && TopRef.current.scrollIntoView();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center text-center bg-black border-white select-none" ref={TopRef}>
      {fragmentExitTakeover(exit)}
      <div className="border border-gray-800 rounded-xl mt-2 px-5 text-center min-w-[300px] max-w-[768px]">
        {fragmentFormHeader()}
        <div className="CONTENT flex-1 text-center">
          {fragmentUsageType()}
          {fragmentTableRate()}
          {fragmentRateSchedule()}
          {fragmentBillablePlayers()}
          {fragmentFormActionButtons()}
        </div>
      </div>
      {fragmentModalConfirm()}
    </div>
  );
}
