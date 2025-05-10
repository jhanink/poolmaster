import { DefaultBillingSchedule, type BillingSchedule, type PlayerRateRules } from "~/config/AppState";
import { ADMIN_ACTION_BUTTONS, ADMIN_ACTIONS, ADMIN_CONTENT, ADMIN_HEADER, ADMIN_SECTION } from "./adminTakeover";
import { TrashIcon } from "@heroicons/react/24/outline";
import { actionButtonStyles, actionIconStyles, formFieldStyles } from "~/util/GlobalStylesUtil";
import { useEffect, useState } from "react";
import ModalConfirm from "../../ui-components/modal/modalConfirm";
import { useAtom } from "jotai";
import { appStateAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";

const ROW = `flex items-center`;
const INPUT_FIELD = `ml-2 w-[150px]`

export default function AdminBillingSchedules() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [SHOW_CONFIRM_SAVE_SCHEDULES, setShowConfirmSaveSchedules] = useState(false);
  const [SCHEDULES, setSchedules] = useState([DefaultBillingSchedule] as BillingSchedule[]);

  const onClickSaveSchedules = () => {
    const billingSchedules = SCHEDULES
      .map((schedule: BillingSchedule) => ({...schedule, forAdd: false}))
      .filter((schedule: BillingSchedule) => !schedule.forDelete);

    const newState = {
      ...APP_STATE,
      billingSchedules,
    }

    AppStorage.setAppStateRemote(newState);
    setAppState(newState);
    setSchedules(billingSchedules);
    setShowConfirmSaveSchedules(false);
  }

  const generateNewSchedule = (index: number = 1) => {
    const id = Date.now() + index;
    const number = SCHEDULES.length + index;
    const newSchedule: BillingSchedule = {
      ...DefaultBillingSchedule,
      id,
      name: `Schedule ${number}`,
    }
    return newSchedule;
  }

  const onClickResetSchedules = (event: any) => {
    if (!APP_STATE.billingSchedules.length) return;
    const schedules = APP_STATE.billingSchedules.map((schedule: BillingSchedule) => ({...schedule}));
    setSchedules(schedules);
  }

  const onClickForDeleteSchedule = (schedule: BillingSchedule) => {
    if (schedule.forAdd) {
      SCHEDULES.splice(SCHEDULES.indexOf(schedule), 1);
      setSchedules([...SCHEDULES]);
      return;
    }
    schedule.forDelete = !schedule.forDelete;
    setSchedules([...SCHEDULES]);
  }

  const onClickAddSchedule = () => {
    const schedules = [...SCHEDULES];
    const newSchedule = generateNewSchedule();
    schedules.push(newSchedule);
    setSchedules(schedules);
  }

  useEffect(() => {
    onClickResetSchedules({} as any);
  }, []);

  return (<>
    <div className={`${ADMIN_SECTION}`}>
      <div className={`flex items-center ${ADMIN_HEADER}`}>
        <div className="pr-5">Billing Schedules</div>
        <button className={`${ADMIN_ACTION_BUTTONS}`} onClick={onClickAddSchedule}>+1</button>
      </div>
      <div className={`${ADMIN_CONTENT}`}>
      {SCHEDULES.map((schedule: BillingSchedule, index: number) => (
          <div className="mb-3 border border-gray-800 rounded-lg p-3" key={schedule.id}>
            <div className={`${ROW}`}>
            {(schedule.id !== DefaultBillingSchedule.id) && (
              <div
                className={`mr-2 ${!!schedule.forDelete && 'text-red-500 hover:text-red-800'} ${!!schedule.forAdd && 'text-green-500 hover:text-green-800'} ${actionIconStyles}`}
                onClick={(event) => {onClickForDeleteSchedule(schedule)}}>
                <TrashIcon></TrashIcon>
              </div>
              )}
              <div className={`whitespace-nowrap  ${!!schedule.forDelete && 'text-red-500'} ${!!schedule.forAdd && 'text-green-500'}`}>
                {schedule.id === DefaultBillingSchedule.id && (
                  <span className="uppercase text-base">{schedule.name}</span>
                )}
                {schedule.id !== DefaultBillingSchedule.id && (<>
                  <span>{index+1}</span>
                  <input
                    readOnly={true} 
                    className={`w-[250px] text-xs ${INPUT_FIELD} ${!!schedule.forDelete && 'text-red-500'} ${!!schedule.forAdd && 'text-green-500'} ${formFieldStyles}`}
                    value={schedule.name}
                    maxLength={55}
                  />
                </>)}
              </div>
            </div>
            <div className={`${ROW} ml-4 mt-1`}>
              Active:
              <input type="checkbox" className="ml-2 size-4" checked={schedule.isActive}
                onChange={(event) => {
                  schedule.isActive = !schedule.isActive;
                  setSchedules([...SCHEDULES]);
                }}
              />
            </div>
            <div className={`${ROW} ml-4 mt-1`}>
              1 hour minimum?
              <input type="checkbox" className="ml-2 size-4" checked={schedule.tableRateRules.isOneHourMinimum}
                onChange={(event) => {
                  schedule.tableRateRules.isOneHourMinimum = !schedule.tableRateRules.isOneHourMinimum;
                  setSchedules([...SCHEDULES]);
                }}
              />
            </div>
            <div className={`${ROW} ml-4 mt-1`}>
              Charge each player?
              <input type="checkbox" className="ml-2 size-4" checked={schedule.tableRateRules.isChargePerPlayer}
                onChange={(event) => {
                  schedule.tableRateRules.isChargePerPlayer = !schedule.tableRateRules.isChargePerPlayer;
                  setSchedules([...SCHEDULES]);
                }}
              />
            </div>
            <div className={`${ROW} ml-4 mt-1`}>
              Player limit
              <input
                type="number"
                value={schedule.playerRateRules.playerLimit}
                placeholder="Rate..."
                maxLength={6}
                min={0}
                max={50}
                className={`w-[75px] ml-2 ${formFieldStyles}`}
                onChange={(event) => {
                  schedule.playerRateRules.playerLimit = Number(event.target.value);
                  setSchedules([...SCHEDULES]);
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className={`${ADMIN_ACTIONS}`}>
        <button className={`${actionButtonStyles}`} onClick={onClickResetSchedules}>Reset</button>
        <button className={`${actionButtonStyles}`} onClick={() => {setShowConfirmSaveSchedules(true)} }>Save</button>
      </div>
    </div>
    <ModalConfirm
      show={SHOW_CONFIRM_SAVE_SCHEDULES}
      dialogTitle={`SAVE SCHEDULES`}
      dialogMessageFn={() => (
        <span className="text-base">
          <div className="mt-3 text-xl text-gray-200">Are you sure?</div>
        </span>
      )}
      onConfirm={() => {onClickSaveSchedules()}}
      onCancel={() => {setShowConfirmSaveSchedules(false)}}
    />
  </>)
}