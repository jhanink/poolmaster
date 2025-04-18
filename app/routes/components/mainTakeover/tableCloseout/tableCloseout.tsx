import { useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";
import { appStateAtom, mainTakoverAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles, formFieldStyles } from "~/util/GlobalStylesUtil";
import { Helpers, type TimeElapsed } from "~/util/Helpers";
import ModalConfirm from "../../ui-components/modal/modalConfirm";
import { fragmentExitTakeover } from "../../fragments/fragments";

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

  // worksheet data
  const [HOURS_DATA, setHoursData] = useState('');
  const [RATE_DATA, setRateData] = useState('');
  const [BILLABLE_DATA, setBillableData] = useState<BillableData>({} as BillableData);

  const TopRef = useRef<HTMLDivElement>(null);

  const onChangeTableHours = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hours = event.target.value
    setHoursData(hours);
  }

  const onChangeTableRate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rate = event.target.value
    setRateData(rate);
  }

  const onClickCancelCheckout = () => {
    MAIN_TAKEOVER.closeoutTable.checkedOutAt = 0;
    setMainTakeover(undefined);
  }

  const setupBillablePlayers = (hours: string, rate: string) => {
    const players = []
    for (let i = 0; i < (MAIN_TAKEOVER.closeoutTable.guest.partySize); i++) {
      players.push({
        id: i,
        name: `Player ${i + 1}`,
        hours,
        rate,
        billable: true,
      });
    }
    players[0].name = MAIN_TAKEOVER.closeoutTable.guest.name.toUpperCase();

    MAIN_TAKEOVER.closeoutTable.guest.extraPlayers.forEach((player, index) => {
      const playersIndex = index + 1;
      if ((playersIndex) > players.length - 1) return;
      players[playersIndex].name = player.name.toUpperCase();
    });

    setBillableData({players});
  }

  const useTableRate = (rate: string) => {
    BILLABLE_DATA.players.forEach((player) => {
      player.rate = rate;
    })
    setBillableData({...BILLABLE_DATA});
  }

  const useTableHours = (hours: string) => {
    BILLABLE_DATA.players.forEach((player) => {
      player.hours = hours;
    })
    setBillableData({...BILLABLE_DATA});
  }

  const onChangePlayerRate = (player: BillablePlayer, event: React.ChangeEvent<HTMLInputElement>) => {
    player.rate = event.target.value;
    setBillableData({...BILLABLE_DATA});
  }

  const onChangePlayerHours = (player: BillablePlayer, event: React.ChangeEvent<HTMLInputElement>) => {
    player.hours = event.target.value;
    setBillableData({...BILLABLE_DATA});
  }

  const onChangePlayerChecked = (player: BillablePlayer, event: React.ChangeEvent<HTMLInputElement>) => {
    player.billable = event.target.checked;
    console.log(player)
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


  const onClickReset = () => {
    const start = MAIN_TAKEOVER.closeoutTable.guest.assignedAt;
    const end = MAIN_TAKEOVER.closeoutTable.guest.checkedOutAt;
    const hours = Helpers.timeElapsed(start, end);
    const rate = MAIN_TAKEOVER.closeoutTable.tableRate;
    setElapsedTime(hours);
    setHoursData(`${hours.durationHoursDecimal}`);
    setRateData(rate);
    setupBillablePlayers(hours.durationHoursDecimal, rate);
  }

  const onClickFinalConfirm = async () => {
    const newAppState = await AppStorage.deleteGuestRemote(MAIN_TAKEOVER.closeoutTable.guest.id);
    setAppState(newAppState);
    setSelectedTable(undefined);
    setMainTakeover(undefined);
  }
  useEffect(() => {
    onClickReset();
    TopRef.current && TopRef.current.scrollIntoView();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center text-center bg-black border-white select-none" ref={TopRef}>
      {fragmentExitTakeover(onClickCancelCheckout)}
      <div className="flex-1 text-center">
        <div className="text-gray-400 mt-5">
          <div className="text-2xl mb-3">
            Close Out <span className="text-green-500">{MAIN_TAKEOVER.closeoutTable.name}</span>
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
                  onChange={onChangeTableHours}
                  value={`${HOURS_DATA}`}
                />
                </div>
                <span className={actionButtonStyles} onClick={() => {useTableHours(HOURS_DATA)}}>use</span>
              </div>
            </div>
            <div className="RATE flex items-center text-base">
              <div className="w-[50px]">
                Rate
              </div>
              <div className="inline-block">
                <div className="inline-block w-[90px]">
                  <input
                    type="text"
                    className={`text-gray-500 w-[70px] ${formFieldStyles}`}
                    onChange={onChangeTableRate}
                    value={`${RATE_DATA}`}
                  />
                </div>
                <span className={actionButtonStyles} onClick={() => {useTableRate(RATE_DATA)}}>use</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-2xl text-gray-400 my-10">
          Total Bill: &nbsp;
          <span className="text-green-500 text-2xl">${playersTotal()}</span>
        </div>

        <div className="WORKSHEET text-left border border-gray-800 p-5 px-20 mx-5 my-10">
          {BILLABLE_DATA.players?.map((player, index) => (
            <div className="PLAYER mb-4" key={player.id}>
              <div>
                <div className="inline-block text-gray-500 mr-3">
                  <input type="checkbox" checked={player.billable} onChange={(event) => {onChangePlayerChecked(player, event)}}></input>
                </div>
                <div className={`inline-block text-base ${index > MAIN_TAKEOVER.closeoutTable.guest.extraPlayers.length ? 'text-gray-300 italic' : 'text-blue-400'}`}>
                  {player.name}
                  {index === 0 && (
                    <div className="inline-block">&nbsp; (Main Player)</div>
                  )}
                </div>
              </div>
              <div className="text-sm ml-7 mt-2">
                <div className="inline-block w-[90px]">
                  <div className="text-xs text-gray-500">HOURS</div>
                  <input
                  type="text"
                    className={`w-[75px] ${formFieldStyles}`}
                    onChange={(event) => {onChangePlayerHours(player, event)}}
                    value={`${player.hours}`}
                  />
                </div>
                <div className="inline-block w-[90px]">
                  <div className="text-xs text-gray-500">RATE</div>
                  <input
                  type="text"
                    className={`w-[75px] ${formFieldStyles}`}
                    onChange={(event) => onChangePlayerRate(player, event)}
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
          ))}
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
