import { DefaultTableRateData, type TableRate } from "~/config/AppState";
import { ADMIN_ACTION_BUTTONS, ADMIN_ACTIONS, ADMIN_CONTENT, ADMIN_HEADER, ADMIN_SECTION } from "./adminTakeover";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  actionButtonStyles,
  actionIconStyles,
  formFieldStyles,
  formInputStyles,
  formInputStylesExtraSmall,
  formInputStylesSmall,
  formLabelLeftStyles,
  INPUT_FIELD,
  ITEM,
  ROW
} from "~/util/GlobalStylesUtil";
import { useEffect, useState } from "react";
import ModalConfirm from "../../ui-components/modal/modalConfirm";
import { useAtom } from "jotai";
import { appStateAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";

export default function AdminSectionTableRates() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [SHOW_CONFIRM_SAVE_TABLE_RATES, setShowConfirmSaveTableRates] = useState(false);
  const [TABLE_RATES, setTableRates] = useState([DefaultTableRateData] as TableRate[]);

  const onClickSaveSchedules = () => {
    const rateSchedules = TABLE_RATES
      .map((schedule: TableRate) => ({...schedule, forAdd: false}))
      .filter((schedule: TableRate) => !schedule.forDelete);

    const newState = {
      ...APP_STATE,
      rateSchedules: rateSchedules,
    }

    AppStorage.setAppStateRemote(newState);
    setAppState(newState);
    setTableRates(rateSchedules);
    setShowConfirmSaveTableRates(false);
  }

  const generateNewSchedule = (index: number = 1) => {
    const id = Date.now() + index;
    const number = TABLE_RATES.length + index;
    const newSchedule: TableRate = {
      ...DefaultTableRateData,
      id,
      name: `Rate ${number}`,
    }
    return newSchedule;
  }

  const onClickResetSchedules = (event: any) => {
    if (!APP_STATE.tableRates.length) return;
    const schedules = APP_STATE.tableRates.map((schedule: TableRate) => ({...schedule}));
    setTableRates(schedules);
  }

  const onClickForDeleteSchedule = (schedule: TableRate) => {
    if (schedule.forAdd) {
      TABLE_RATES.splice(TABLE_RATES.indexOf(schedule), 1);
      setTableRates([...TABLE_RATES]);
      return;
    }
    schedule.forDelete = !schedule.forDelete;
    setTableRates([...TABLE_RATES]);
  }

  const onClickAddSchedule = () => {
    const schedules = [...TABLE_RATES];
    const newSchedule = generateNewSchedule();
    schedules.push(newSchedule);
    setTableRates(schedules);
  }

  useEffect(() => {
    onClickResetSchedules({} as any);
  }, []);

  return (<>
    <div className={`${ADMIN_SECTION}`}>
      <div className={`flex items-center ${ADMIN_HEADER}`}>
        <div className="pr-5">Table Rates</div>
        <button className={`${ADMIN_ACTION_BUTTONS}`} onClick={onClickAddSchedule}>+1</button>
      </div>
      <div className={`${ADMIN_CONTENT}`}>
      {TABLE_RATES.map((schedule: TableRate, index: number) => (
          <div className={`${ITEM}`} key={schedule.id}>
            <div className={`${ROW}`}>
              {(schedule.id !== DefaultTableRateData.id) && (
                <div
                  className={`mr-2 ${!!schedule.forDelete && 'text-red-500 hover:text-red-800'} ${!!schedule.forAdd && 'text-green-500 hover:text-green-800'} ${actionIconStyles}`}
                  onClick={(event) => {onClickForDeleteSchedule(schedule)}}>
                  <TrashIcon></TrashIcon>
                </div>
              )}
              {(schedule.id === DefaultTableRateData.id) && (
                "DEFAULT"
              )}
              {(schedule.id !== DefaultTableRateData.id) && (
                <span>{index+1}</span>
              )}
              <div className={`whitespace-nowrap  ${!!schedule.forDelete && 'text-red-500'} ${!!schedule.forAdd && 'text-green-500'}`}>
                <input
                  className={`${formInputStyles} w-[250px] text-sm ${INPUT_FIELD} ${!!schedule.forDelete && 'text-red-500'} ${!!schedule.forAdd && 'text-green-500'} ${formFieldStyles}`}
                  onChange={(event) => {
                    schedule.name = event.target.value.trim();
                    setTableRates([...TABLE_RATES]);
                  }}
                  value={schedule.name}
                  maxLength={55}
                />
              </div>
            </div>
            {(schedule.id !== DefaultTableRateData.id) && (
              <div className={`${ROW} ml-4 mt-1`}>
                <div className={`${formLabelLeftStyles}`}>
                  Active:
                </div>
                <input type="checkbox" className={`ml-2 size-4`} checked={schedule.isActive}
                  onChange={(event) => {
                    schedule.isActive = !schedule.isActive;
                    setTableRates([...TABLE_RATES]);
                  }}
                />
              </div>
            )}
            <div className={`${ROW} ml-4 mt-1`}>
              <div className={`${formLabelLeftStyles}`}>
                Base Rate:
              </div>
              <div className="inline-block">
                <input
                  className={`${formInputStylesSmall}`}
                  value={schedule.tableRateRules.hourlyRate}
                  placeholder="Rate..."
                  maxLength={6}
                  onChange={(event) => {
                    schedule.tableRateRules.hourlyRate = event.target.value.trim();
                    setTableRates([...TABLE_RATES]);
                  }}
                />
              </div>
            </div>
            <div className={`${ROW} ml-4 mt-1`}>
              <div className={`${formLabelLeftStyles}`}>
                1 hour minimum?
              </div>
              <input type="checkbox" className="ml-2 size-4" checked={schedule.tableRateRules.isOneHourMinimum}
                onChange={(event) => {
                  schedule.tableRateRules.isOneHourMinimum = !schedule.tableRateRules.isOneHourMinimum;
                  setTableRates([...TABLE_RATES]);
                }}
              />
            </div>
            <div className={`${ROW} ml-4 mt-1`}>
              <div className={`${formLabelLeftStyles}`}>
                Per player?
              </div>
              <input type="checkbox" className="ml-2 size-4" checked={schedule.tableRateRules.isChargePerPlayer}
                onChange={(event) => {
                  schedule.tableRateRules.isChargePerPlayer = !schedule.tableRateRules.isChargePerPlayer;
                  setTableRates([...TABLE_RATES]);
                }}
              />
            </div>
            {schedule.tableRateRules.isChargePerPlayer && (<>
              <div className={`${ROW} ml-8 mt-1`}>
                <div className={`${formLabelLeftStyles}`}>
                  Player Limit:
                </div>
                <input
                  type="number"
                  value={schedule.playerRateRules.playerLimit}
                  maxLength={2}
                  min={0}
                  max={99}
                  className={`${formInputStylesExtraSmall}`}
                  onChange={(event) => {
                    schedule.playerRateRules.playerLimit = Number(event.target.value.trim());
                    setTableRates([...TABLE_RATES]);
                  }}
                />
              </div>
              <div className={`${ROW} ml-8 mt-1`}>
                <div className={`${formLabelLeftStyles}`}>
                  Rate after limit:
                </div>
                <input
                  value={schedule.playerRateRules.afterLimitRate}
                  maxLength={6}
                  className={`${formInputStylesSmall}`}
                  placeholder="Rate..."
                  onChange={(event) => {
                    schedule.playerRateRules.afterLimitRate = event.target.value.trim();
                    setTableRates([...TABLE_RATES]);
                  }}
                />
              </div>
            </>)}
          </div>
        ))}
      </div>
      <div className={`${ADMIN_ACTIONS}`}>
        <button className={`${actionButtonStyles}`} onClick={onClickResetSchedules}>Reset</button>
        <button className={`${actionButtonStyles}`} onClick={() => {setShowConfirmSaveTableRates(true)} }>Save</button>
      </div>
    </div>
    <ModalConfirm
      show={SHOW_CONFIRM_SAVE_TABLE_RATES}
      dialogTitle={`SAVE SCHEDULES`}
      dialogMessageFn={() => (
        <span className="text-base">
          <div className="mt-3 text-xl text-gray-200">Are you sure?</div>
        </span>
      )}
      onConfirm={() => {onClickSaveSchedules()}}
      onCancel={() => {setShowConfirmSaveTableRates(false)}}
    />
  </>)
}
