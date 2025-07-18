import { useAtom } from "jotai";
import { ADMIN_ACTION_BUTTONS, ADMIN_ACTIONS, ADMIN_CONTENT, ADMIN_HEADER, ADMIN_HEADER_STICKY, ADMIN_HEADER_STICKY_SPACER_TOP, ADMIN_SECTION } from "./admin";
import { useEffect, useState } from "react";
import { appStateAtom } from "~/appStateGlobal/atoms";
import { DEFAULT_ID, DefaultRateSchedule, RateScheduleDays, type RateSchedule } from "~/config/AppState";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles, actionIconStyles, ADMIN_SECTION_SCROLL_MARGIN_TOP, formFieldStyles, formInputStyles, formLabelLeftStyles, INPUT_FIELD, INPUT_FIELD_LG, INPUT_FIELD_MED, ITEM, ROW } from "~/util/GlobalStylesUtil";
import { TrashIcon } from "@heroicons/react/24/outline";
import ModalConfirm from "../../ui-components/modal/modalConfirm";

const fieldLabelStyles = `mx-2 w-[65px]`;
const borderColor = 'border rounded-lg !border-purple-400';
const bgColor = 'bg-purple-400';

export default function AdminRateSchedules(props: {
  ref: React.RefObject<HTMLDivElement>;
}) {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [RATE_SCHEDULES, setRateSchedules] = useState([] as RateSchedule[]);
  const [SHOW_CONFIRM_SAVE, setShowConfirmSave] = useState(false);

  const onClickResetForm = () => {
    if (!APP_STATE.rateSchedules.length) return;
    const rateSchedules = APP_STATE.rateSchedules.map((rateSchedule: RateSchedule) => ({...rateSchedule}));
    setRateSchedules(rateSchedules);
    props.ref.current.scrollIntoView(true);
  }

  const onClickSaveItem = () => {
    const rateSchedules = RATE_SCHEDULES
      .map((rateSchedule: RateSchedule) => ({...rateSchedule, forAdd: false, show: false}))
      .filter((rateSchedule: RateSchedule) => !rateSchedule.forDelete);

    const newState = {
      ...APP_STATE,
      rateSchedules,
    }

    AppStorage.setAppStateRemote(newState);
    setAppState(newState);
    setRateSchedules(rateSchedules);
    setShowConfirmSave(false);
    props.ref.current.scrollIntoView(true);
  }

  const generateNewItem = (index: number = 1) => {
    const id = Date.now() + index;
    const number = RATE_SCHEDULES.length + index;
    const newRateSchedule: RateSchedule = {
      ...DefaultRateSchedule,
      id,
      name: `Rate Schedule ${number}`,
    }
    return newRateSchedule;
  }

  const onClickForDeleteItem = (rateSchedule: RateSchedule) => {
    if (rateSchedule.forAdd) {
      RATE_SCHEDULES.splice(RATE_SCHEDULES.indexOf(rateSchedule), 1);
      setRateSchedules([...RATE_SCHEDULES]);
      return;
    }
    rateSchedule.forDelete = !rateSchedule.forDelete;
    setRateSchedules([...RATE_SCHEDULES]);
  }

  const onClickAddItem = () => {
    const rateSchedules = [...RATE_SCHEDULES];
    const newRateSchedule = generateNewItem();
    rateSchedules.push(newRateSchedule);
    setRateSchedules(rateSchedules);
  }

  useEffect(() => {
    onClickResetForm();
  }, []);

  return (<>
    <div className={`${ADMIN_SECTION}`} style={ADMIN_SECTION_SCROLL_MARGIN_TOP} ref={props.ref}>
      <div className={`${ADMIN_HEADER_STICKY}`}>
        <div className={`${ADMIN_HEADER_STICKY_SPACER_TOP}`}>
          <div className={`${borderColor}`}>
            <div className={`${ADMIN_HEADER} ${bgColor}`}>
              <div className={`flex items-center`}>
                <div className="pr-2">Rate Schedules</div>
                <button className={`${ADMIN_ACTION_BUTTONS}`} onClick={onClickAddItem}>+1</button>
              </div>
              <div>
                <div className="italic text-sm">Variable day rate schedules</div>
              </div>
            </div>
            <div className={`${ADMIN_ACTIONS}`}>
              <button className={`${actionButtonStyles}`} onClick={onClickResetForm}>Reset</button>
              <button className={`${actionButtonStyles}`} onClick={() => {setShowConfirmSave(true)} }>Save</button>
            </div>
          </div>
        </div>
      </div>
      <div className={`${ADMIN_CONTENT}`}>
        {RATE_SCHEDULES.map((rateSchedule: RateSchedule, index: number) => (
          <div className={`${rateSchedule.isActive? `${borderColor}`: '!border-gray-500 border-dashed opacity-50'} ${ITEM}`} key={rateSchedule.id}>
            <div className={`${ROW}`}>
              {(rateSchedule.id !== DEFAULT_ID) && (
                <div
                  className={`mr-2 ${!!rateSchedule.forDelete && 'text-rose-500 hover:text-red-800'} ${!!rateSchedule.forAdd && 'text-green-500 hover:text-green-800'} ${actionIconStyles}`}
                  onClick={(event) => {onClickForDeleteItem(rateSchedule)}}>
                  <TrashIcon></TrashIcon>
                </div>
              )}
              {(rateSchedule.id === DEFAULT_ID) && (
                "DEFAULT"
              )}
              {(rateSchedule.id !== DEFAULT_ID) && (
                <span>{index+1}</span>
              )}
              <div className={`text-nowrap ${!!rateSchedule.forDelete && 'text-rose-500'} ${!!rateSchedule.forAdd && 'text-green-500'}`}>
                <input
                  disabled={rateSchedule.id === DEFAULT_ID}
                  className={`
                    ${rateSchedule.id === DEFAULT_ID ? INPUT_FIELD_MED : INPUT_FIELD_LG}
                    ${rateSchedule.id === DEFAULT_ID ? 'select-none text-gray-500' : ''}
                    ${formInputStyles} ${INPUT_FIELD} ${!!rateSchedule.forDelete && 'text-rose-500'}
                    ${!!rateSchedule.forAdd && 'text-green-500'}
                    ${formFieldStyles}
                  `}
                  onChange={(event) => {
                    rateSchedule.name = event.target.value;
                    setRateSchedules([...RATE_SCHEDULES]);
                  }}
                  value={rateSchedule.name}
                  maxLength={55}
                />
              </div>
            </div>
            {(rateSchedule.id !== DEFAULT_ID) && (
              <div className={`${ROW} mt-1`}>
                <div className={`w-[80px] text-sm text-nowrap ${formLabelLeftStyles} ${rateSchedule.isActive? '!text-purple-500':''}`}>
                  ENABLED:
                </div>
                <input
                  type="checkbox"
                  className={`ml-2 size-4`}
                  checked={rateSchedule.isActive}
                  onChange={(event) => {
                    rateSchedule.isActive = !rateSchedule.isActive;
                    setRateSchedules([...RATE_SCHEDULES]);
                  }}
                />
              </div>
            )}
            {(rateSchedule.id !== DEFAULT_ID) && (
              <div className={`${ROW} mt-2`}>
                <div className={`w-[80px] text-sm text-nowrap ${formLabelLeftStyles} ${rateSchedule.show? '!text-cyan-500':''}`}>
                  VIEW:
                </div>
                <input
                  type="checkbox"
                  className={`ml-2 size-4`}
                  checked={rateSchedule.show}
                  onChange={(event) => {
                    rateSchedule.show = !rateSchedule.show;
                    setRateSchedules([...RATE_SCHEDULES]);
                  }}
                />
              </div>
            )}
            {(rateSchedule.id !== DEFAULT_ID) && (rateSchedule.show) && (
              <div className="ml-1 pl-3 border border-gray-800 rounded-md mt-5">
                {RateScheduleDays.map((day: string) => (
                  <div className="text-gray-500 " key={day}>
                    <div className={`${ROW} mt-3`}>
                      <div className={`w-[45px] uppercase !text-gray-100 text-sm text-nowrap ${formLabelLeftStyles}`}>
                        {day}:
                      </div>
                    </div>
                    <div className="ml-5">
                      <div className={`${ROW} mt-1`}>
                        <span className={`${fieldLabelStyles}`}>Start</span>
                        <input
                          className={`${formInputStyles} ${INPUT_FIELD}`}
                          type="time"
                          value={rateSchedule.entries[day].start}
                          onChange={(event) => {
                            rateSchedule.entries[day].start = event.target.value;
                            setRateSchedules([...RATE_SCHEDULES]);
                          }}
                        />
                      </div>
                      <div className={`${ROW} mt-1`}>
                        <span className={`${fieldLabelStyles}`}>End</span>
                        <input
                          className={`${formInputStyles} ${INPUT_FIELD}`}
                          type="time"
                          value={rateSchedule.entries[day].end}
                          onChange={(event) => {
                            rateSchedule.entries[day].end = event.target.value;
                            setRateSchedules([...RATE_SCHEDULES]);
                          }}
                        />
                      </div>
                      <div className={`${ROW} mt-1`}>
                        <span className={`${fieldLabelStyles}`}>Before:</span>
                        <input
                          className={`${formInputStyles} ${INPUT_FIELD}`}
                          type="number"
                          step="0.01"
                          value={rateSchedule.entries[day].rateBefore}
                          onChange={(event) => {
                            rateSchedule.entries[day].rateBefore = event.target.value;
                            setRateSchedules([...RATE_SCHEDULES]);
                          }}
                        />
                      </div>
                      <div className={`${ROW} mt-1`}>
                        <span className={`${fieldLabelStyles}`}>During:</span>
                        <input
                          className={`${formInputStyles} ${INPUT_FIELD}`}
                          type="number"
                          step="0.01"
                          value={rateSchedule.entries[day].rateDuring}
                          onChange={(event) => {
                            rateSchedule.entries[day].rateDuring = event.target.value;
                            setRateSchedules([...RATE_SCHEDULES]);
                          }}
                        />
                      </div>
                      <div className={`${ROW} mt-1`}>
                        <span className={`${fieldLabelStyles}`}>After:</span>
                        <input
                          className={`${formInputStyles} ${INPUT_FIELD}`}
                          type="number"
                          step="0.01"
                          value={rateSchedule.entries[day].rateAfter}
                          onChange={(event) => {
                            rateSchedule.entries[day].rateAfter = event.target.value;
                            setRateSchedules([...RATE_SCHEDULES]);
                          }}
                        />
                      </div>
                      <div className={`${ROW} mt-1`}>
                        <span className={`${fieldLabelStyles}`}>1 Hour Min:</span>
                        <input
                          className={`${formInputStyles} ${INPUT_FIELD}`}
                          type="number"
                          step="0.01"
                          value={rateSchedule.entries[day].rate1hrMin}
                          onChange={(event) => {
                            rateSchedule.entries[day].rate1hrMin = event.target.value;
                            setRateSchedules([...RATE_SCHEDULES]);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    <ModalConfirm
      show={SHOW_CONFIRM_SAVE}
      dialogTitle={`SAVE RATE SCHEDULES`}
      dialogMessageFn={() => (
        <span className="text-base">
          <div className="mt-3 text-xl text-gray-200">Are you sure?</div>
        </span>
      )}
      onConfirm={() => {onClickSaveItem()}}
      onCancel={() => {setShowConfirmSave(false)}}
    />
  </>)
}
