import type { BillingSchedule, ChargeEachPlayerRules } from "~/config/AppState";
import { ADMIN_ACTION_BUTTONS, ADMIN_ACTIONS, ADMIN_CONTENT, ADMIN_HEADER, ADMIN_SECTION } from "./adminTakeover";
import { TrashIcon } from "@heroicons/react/24/outline";
import { actionButtonStyles, actionIconStyles, formFieldStyles } from "~/util/GlobalStylesUtil";
import { Checkbox } from "@headlessui/react";
import { useEffect, useState } from "react";
import ModalConfirm from "../../ui-components/modal/modalConfirm";
import { useAtom } from "jotai";
import { appStateAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";

export default function AdminBillingSchedules() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [SHOW_CONFIRM_SAVE_SCHEDULES, setShowConfirmSaveSchedules] = useState(false);
  const [SCHEDULES, setSchedules] = useState([] as BillingSchedule[]);

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
      id,
      name: `Schedule ${number}`,
      weekdayRate: "",
      weekendRate: "",
      holidayRate: "",
      startTime: "",
      endTime: "",
      isChargeEachPlayer: false,
      isChargeByNumberOfPlayers: false,
      chargeEachPlayerRules: {
        maxNumberOfPlayersAtFullRate: 0,
        overMaxPlayerRate: 0,
      } as ChargeEachPlayerRules,
      hourlyRate: 0,
      minimumChargeHours: 0,
      forDelete: false,
      forAdd: true,
      isActive: true,
    }
    return newSchedule;
  }

  const onClickResetSchedules = (event: any) => {
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
      <h2 className={`${ADMIN_HEADER}`}>
        <span className="pr-5">Billing Schedules</span>
        <button className={ADMIN_ACTION_BUTTONS} onClick={onClickAddSchedule}>+1</button>
      </h2>
      <div className={`${ADMIN_CONTENT}`}>
      {SCHEDULES.map((schedule: BillingSchedule, index: number) => (
          <div className="mb-3" key={schedule.id}>
            <div className={`flex`}>
              <div className={`mr-2 ${!!schedule.forDelete && 'text-red-500 hover:text-red-800'} ${!!schedule.forAdd && 'text-green-500 hover:text-green-800'} ${actionIconStyles}`}
              onClick={(event) => {onClickForDeleteSchedule(schedule)}}>
                <TrashIcon></TrashIcon>
              </div>
              <div className={`whitespace-nowrap ${!!schedule.forDelete && 'text-red-500'} ${!!schedule.forAdd && 'text-green-500'}`}>
                {index+1}
                <input
                  className={`w-[150px] ${!!schedule.forDelete && 'text-red-500'} ${!!schedule.forAdd && 'text-green-500'} ${formFieldStyles}`}
                  value={schedule.name}
                  placeholder="Schedule name..."
                  maxLength={55}
                  onChange={(event) => {
                    schedule.name = event.target.value;
                    setSchedules([...SCHEDULES]);
                  }}
                />
              </div>
            </div>
            <div className="flex">
              isActive:
              <Checkbox
                className={`size-4`}
                checked={schedule.isActive}
                onChange={(event) => {
                  schedule.isActive = !schedule.isActive;
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