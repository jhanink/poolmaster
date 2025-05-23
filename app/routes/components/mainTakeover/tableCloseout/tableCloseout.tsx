import { useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";
import { appStateAtom, mainTakoverAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles, formFieldStyles, formSelectStyles, optionStyles, usageTypeIndicatorStyles } from "~/util/GlobalStylesUtil";
import { Helpers, type TimeElapsed } from "~/util/Helpers";
import ModalConfirm from "../../ui-components/modal/modalConfirm";
import { fragmentExitTakeover } from "../../fragments/fragments";
import { DEFAULT_ID, DefaultTableRateData, type Guest, type PlayerRateRules, type TableItem, type TableRate, type TableRateRules } from "~/config/AppState";

type BillablePlayer = {
  id: number,
  name: string,
  hours: string,
  rate: string,
  billable: boolean,
}
type BillableData = {
  players: BillablePlayer[],
}

export default function TableCloseout() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [, setSelectedTable] = useAtom(selectedTableAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);
  const [, setElapsedTime] = useState<TimeElapsed>({} as TimeElapsed);
  const [SHOW_CONFIRM_CLOSEOUT, setShowConfirmCloseout] = useState(false);
  const [HOURS_DATA, setHoursData] = useState('');
  const [BILLABLE_DATA, setBillableData] = useState<BillableData>({} as BillableData);
  const [SELECTED_RATE, setSelectedRate] = useState<TableRate>(DefaultTableRateData);

  const TopRef = useRef<HTMLDivElement>(null);

  const onClickCancelCheckout = () => {
    MAIN_TAKEOVER.closeoutTable.guest.closedOutAt = 0;
    setMainTakeover(undefined);
  }

  const setupBillablePlayers = () => {
    if (!SELECTED_RATE.id) return;

    const table: TableItem = MAIN_TAKEOVER.closeoutTable;

    const tableRateRules: TableRateRules = SELECTED_RATE.tableRateRules;
    const playerRateRules: PlayerRateRules = SELECTED_RATE.playerRateRules;

    const guest: Guest = table.guest;
    const start = guest.assignedAt;
    const end = guest.closedOutAt;
    const time: TimeElapsed = Helpers.timeElapsed(start, end);
    const hours = (tableRateRules.isOneHourMinimum && (time.hoursExact < 1 )) ? `1.000` : time.durationHoursDecimal3;
    const rate = tableRateRules.hourlyRate;
    const isChargePerPlayer = tableRateRules.isChargePerPlayer;
    const playerLimit = playerRateRules.playerLimit;
    const afterLimitRate = playerRateRules.afterLimitRate;

    const PLAYERS_COUNT = isChargePerPlayer ? Math.max(guest.partySize, guest.extraPlayers.length + 1) : 1;
    const players: BillablePlayer[] = [];

    for (let i = 0; i < (PLAYERS_COUNT); i++) {
      const playerRate = (isChargePerPlayer && (i >= playerLimit)) ? afterLimitRate : rate;
      players.push({
        id: i,
        name: `Player ${i + 1}`,
        hours,
        rate: playerRate,
        billable: true,
      });
    }
    players[0].name = guest.name.toUpperCase();

    guest.extraPlayers.forEach((player, index) => {
      const playersIndex = index + 1;
      if ((playersIndex) > players.length - 1) return;
      players[playersIndex].name = player.name.toUpperCase();
      const time = Helpers.timeElapsed(player.assignedAt, guest.closedOutAt);
      const hours = (tableRateRules.isOneHourMinimum && (time.hoursExact < 1 )) ? `1.000` : time.durationHoursDecimal3;
      players[playersIndex].hours = hours;
    });

    setBillableData({players});
  }

  const onChangeTableRate = (event) => {
    const selectedRate: TableRate = APP_STATE.tableRates.find((rate) => rate.id === Number(event.target.value));
    setSelectedRate(selectedRate);
    const players: BillablePlayer[] = BILLABLE_DATA.players.map((player) => {
      player.rate = selectedRate.tableRateRules.hourlyRate;
      return player;
    });
    setBillableData({...BILLABLE_DATA, players});
  }

  const useTableHours = (hours: string) => {
    BILLABLE_DATA.players.forEach((player) => {
      player.hours = hours;
    })
    setBillableData({...BILLABLE_DATA});
  }

  const playersTotal = () => {
    let total = 0;
    BILLABLE_DATA.players?.forEach((player) => {
      if (player.billable) {
        const hours = SELECTED_RATE.tableRateRules.isFlatRate ? 1 : Number(player.hours);
        total += hours * Number(player.rate);
      }
    })
    return total.toFixed(2);
  }

  const playerAssignedAt = (player: BillablePlayer, index: number) => {
    const guest: Guest = MAIN_TAKEOVER.closeoutTable.guest;
    const assignedAt = !index ? guest.assignedAt : ((guest.extraPlayers[index - 1]?.assignedAt) || guest.assignedAt);
    return new Date(assignedAt).toLocaleString();
  }

  const onClickReset = () => {
    const table: TableItem = MAIN_TAKEOVER.closeoutTable;
    const guest: Guest = table.guest;
    const start = guest.assignedAt;
    const end = guest.closedOutAt;
    const hours = Helpers.timeElapsed(start, end);
    setElapsedTime(hours);
    setHoursData(`${hours.durationHoursDecimal3}`);
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
    const newAppState = await AppStorage.deleteGuestRemote(MAIN_TAKEOVER.closeoutTable.guest.id);
    setAppState(newAppState);
    setSelectedTable(undefined);
    setMainTakeover(undefined);
  }

  const fragmentTableRate = () => {
    return (
      <div className="mt-3">
        <div className="text-sm uppercase text-gray-500">
          Table Rate
        </div>
        <div>
          <select
            onChange={onChangeTableRate}
            value={SELECTED_RATE.id}
            className={`${formSelectStyles} text-center !text-lg`}
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
    const icon = (usageType && !!usageType.useIcon && usageType.icon);
    return (<>
      <div className="mt-7 text-base">
        {(guest.usageTypeId !== DEFAULT_ID) && (<>
          <div className={`${usageTypeIndicatorStyles}`}>
            <span className="text-gray-400" style={{color: usageType.textColor}}>{usageType.name}</span>
            {!!icon && (
              <span className="ml-2">{icon}</span>
            )}
          </div>
        </>)}
      </div>
    </>)
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
      {fragmentExitTakeover(onClickCancelCheckout)}
      <div className="CONTENT flex-1 text-center">
        <div className="text-gray-400 mt-5">
          <div className="text-2xl mb-3">
            <span className="text-gray-600 mr-3">Close Out</span>
            <span className="text-green-500">{MAIN_TAKEOVER.closeoutTable.name}</span>
          </div>

          {!SELECTED_RATE.tableRateRules.isFlatRate && (
            <div className="inline-block text-right">
              <div className="mr-1 text-center text-gray-500">
                  HOURS
                </div>
              <div className="TIME flex items-center mb-2">
                <div className="inline-block shrink">
                  <input
                    type="text"
                    className={`text-gray-500 w-[100px] !text-center !text-lg ${formFieldStyles}`}
                    maxLength={6}
                    value={HOURS_DATA}
                    onChange={(event) => {
                      const hours = event.target.value.trim()
                      setHoursData(hours);
                      useTableHours(hours);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {fragmentTableRate()}
        {fragmentUsageType()}

        <div className="WORKSHEET mt-2 text-left ">
          {BILLABLE_DATA.players?.map((player, index) => (<div key={player.id}>
            <div className={`PLAYER mb-2 p-4 border ${player.billable? 'border-green-800' : 'border-dashed border-gray-500 opacity-50'} rounded-xl`}>

              <div className="flex">
                <div className="shrink">
                  <input
                    type="checkbox"
                    checked={player.billable}
                    onChange={(event) => {
                      player.billable = event.target.checked;
                      setBillableData({...BILLABLE_DATA});
                    }}
                  />
                </div>
                <div className="grow">
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
                    <div className="text-sm mt-2">
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
                    <div className="text-center text-xl text-green-500 mt-2">
                      ${(Number(player.hours) * Number(player.rate)).toFixed(2)}
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

        <div className="my-3 mb-20">
          <button className={`${actionButtonStyles} mx-2`} onClick={onClickReset}>Reset</button>
          <button className={`${actionButtonStyles} mx-2`} onClick={() => {setShowConfirmCloseout(true)}}>Close Out {MAIN_TAKEOVER.closeoutTable.name}</button>
        </div>
      </div>
      <ModalConfirm
        show={SHOW_CONFIRM_CLOSEOUT}
        dialogTitle={`CLOSE OUT ${MAIN_TAKEOVER.closeoutTable.name}`}
        dialogMessageFn={() => <div className="text-base">
          <div className="mt-3 text-xl text-blue-500">{MAIN_TAKEOVER.closeoutTable.guest.name.toUpperCase()}</div>
          <div className="mt-2 text-2xl">Total: <span className="text-green-500">${playersTotal()}</span></div>
        </div>}
        onConfirm={onClickFinalConfirm}
        onCancel={() => {setShowConfirmCloseout(false)}}
      />
    </div>
  );
}
