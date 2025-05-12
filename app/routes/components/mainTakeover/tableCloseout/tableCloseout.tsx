import { useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";
import { appStateAtom, mainTakoverAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles, formFieldStyles, formSelectStyles, optionStyles } from "~/util/GlobalStylesUtil";
import { Helpers, type TimeElapsed } from "~/util/Helpers";
import ModalConfirm from "../../ui-components/modal/modalConfirm";
import { fragmentExitTakeover } from "../../fragments/fragments";
import { type Guest, type PlayerRateRules, type TableItem, type TableRate, type TableRateRules } from "~/config/AppState";

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
  const [SELECTED_RATE, setSelectedRate] = useState<TableRate>({} as TableRate);

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
      players[playersIndex].hours = time.hoursExact < 1? `1.000` : `${time.durationHoursDecimal3}`;
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
        total += Number(player.hours) * Number(player.rate);
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
    const tableTypeId = table.tableTypeId;
    const tableType = APP_STATE.tableTypes.find((type) => type.id === tableTypeId);

    // Initially set tableRate to the tableType's rate
    let tableRate: TableRate = APP_STATE.tableRates.find((rate) => (rate.id === tableType.tableRateId) && rate.isActive);

    // If the table config ignores tableType rate, use table-specific rate
    if (table.ignoreTableTypeRate) {
      tableRate = APP_STATE.tableRates.find((rate) => (rate.id === table.tableRateId) && rate.isActive);
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
            <span className="text-green-500">{MAIN_TAKEOVER.closeoutTable.name}</span>
          </div>
          <div className="inline-block text-right">
            <div className="TIME flex items-center text-base mb-2">
              <div className="w-[50px]">
                Hours
              </div>
              <div className="inline-block">
              <div className="inline-block w-[90px]">
                <input
                  type="text"
                  className={`text-gray-500 w-[70px] ${formFieldStyles}`}
                  maxLength={6}
                  onChange={(event) => {
                    const hours = event.target.value.trim()
                    setHoursData(hours);
                  }}
                  value={`${HOURS_DATA}`}
                />
                </div>
                <span className={actionButtonStyles} onClick={() => {useTableHours(HOURS_DATA)}}>use</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mt-2">
            <select
              onChange={onChangeTableRate}
              value={SELECTED_RATE.id}
              className={`${formSelectStyles}`}
            >
              {APP_STATE.tableRates
                .filter((rate) => rate.isActive)
                .map((rate) => (
                <option key={rate.id} className={optionStyles} value={rate.id}>{rate.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xl text-gray-400 mt-4">
          Bill Total: &nbsp;
          <span className="text-green-500 text-xl">${playersTotal()}</span>
        </div>

        <div className="WORKSHEET text-left p-5 mx-5 mt-2">
          {BILLABLE_DATA.players?.map((player, index) => (<>
            <div className={`PLAYER mb-2 p-4 border ${player.billable? 'border-yellow-800' : 'border-dashed border-gray-500 opacity-50'} rounded-xl`} key={player.id}>
              <div>
                <div className="inline-block text-gray-500 mr-3">
                  <input
                    type="checkbox"
                    checked={player.billable}
                    onChange={(event) => {
                      player.billable = event.target.checked;
                      setBillableData({...BILLABLE_DATA});
                    }}
                  />
                </div>
                <div className={`inline-block text-base ${(index > MAIN_TAKEOVER.closeoutTable.guest.extraPlayers.length) ? 'text-gray-300 italic' : 'text-green-700'}`}>
                  {player.name}
                  {index === 0 && (
                    <div className="inline-block">&nbsp; (Main Player)</div>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500 ml-7">
                {playerAssignedAt(player, index)}
              </div>
              <div className="text-sm ml-7 mt-2">
                <div className="inline-block w-[90px]">
                  <div className="text-xs text-gray-500">HOURS</div>
                  <input
                  type="text"
                    className={`w-[75px] ${formFieldStyles}`}
                    onChange={(event) => {
                      player.hours = event.target.value;
                      setBillableData({...BILLABLE_DATA});
                    }}
                    value={`${player.hours}`}
                  />
                </div>
                <div className="inline-block w-[90px]">
                  <div className="text-xs text-gray-500">RATE</div>
                  <input
                    type="text"
                    className={`w-[75px] ${formFieldStyles}`}
                    maxLength={6}
                    onChange={(event) => {
                      player.rate = event.target.value;
                      setBillableData({...BILLABLE_DATA});
                    }}
                    value={`${player.rate}`}
                  />
                </div>
                <div className="inline-block w-[90px] text-gray-500">
                = &nbsp;
                  <div className="inline-block text-base text-green-500">
                    ${(Number(player.hours) * Number(player.rate)).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            {SELECTED_RATE.tableRateRules.isChargePerPlayer && (index+1 === SELECTED_RATE.playerRateRules.playerLimit)  && (<>
            <div className="mb-3 text-center text-sm text-gray-500 py-2 italic">
              Regular rate player Limit: {SELECTED_RATE.playerRateRules.playerLimit}
            </div>
            </>)}

          </>))}
        </div>

        <div className="text-xl text-gray-400 mb-5">
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
