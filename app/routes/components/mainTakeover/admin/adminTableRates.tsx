import { DEFAULT_ID, DefaultTableRateData, PARTY_SIZE_ARRAY, type TableRate } from "~/config/AppState";
import { ADMIN_ACTION_BUTTONS, ADMIN_ACTIONS, ADMIN_CONTENT, ADMIN_HEADER, ADMIN_HEADER_STICKY, ADMIN_HEADER_STICKY_SPACER_TOP, ADMIN_SECTION } from "./admin";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  actionButtonStyles,
  actionIconStyles,
  ADMIN_SECTION_SCROLL_MARGIN_TOP,
  formFieldStyles,
  formInputStyles,
  formInputStylesSmall,
  formLabelLeftStyles,
  formSelectStyles,
  INPUT_FIELD_LG,
  INPUT_FIELD_MED,
  ITEM,
  optionStyles,
  ROW
} from "~/util/GlobalStylesUtil";
import { useEffect, useState } from "react";
import ModalConfirm from "../../ui-components/modal/modalConfirm";
import { useAtom } from "jotai";
import { appStateAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";

const borderColor = 'border rounded-lg !border-yellow-400';
const bgColor = 'bg-yellow-400';

export default function AdminTableRates(props: {
  ref: React.RefObject<HTMLDivElement>;
}) {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [TABLE_RATES, setTableRates] = useState([] as TableRate[]);
  const [SHOW_CONFIRM_SAVE, setShowConfirmSave] = useState(false);

  const onClickResetForm = () => {
    if (!APP_STATE.tableRates.length) return;
    const tableRates = APP_STATE.tableRates.map((tableRate: TableRate) => ({...tableRate}));
    setTableRates(tableRates);
    props.ref.current.scrollIntoView(true);
  }

  const onClickSaveItem = () => {
    const tableRates = TABLE_RATES
      .map((tableRate: TableRate) => ({...tableRate, forAdd: false}))
      .filter((tableRate: TableRate) => !tableRate.forDelete);

    const newState = {
      ...APP_STATE,
      tableRates,
    }

    AppStorage.setAppStateRemote(newState);
    setAppState(newState);
    setTableRates(tableRates);
    setShowConfirmSave(false);
    props.ref.current.scrollIntoView(true);
  }

  const generateNewItem = (index: number = 1) => {
    const id = Date.now() + index;
    const number = TABLE_RATES.length + index;
    const newTableRate: TableRate = {
      ...DefaultTableRateData,
      id,
      name: `Rate ${number}`,
    }
    return newTableRate;
  }

  const onClickForDeleteItem = (tableRate: TableRate) => {
    if (tableRate.forAdd) {
      TABLE_RATES.splice(TABLE_RATES.indexOf(tableRate), 1);
      setTableRates([...TABLE_RATES]);
      return;
    }
    tableRate.forDelete = !tableRate.forDelete;
    setTableRates([...TABLE_RATES]);
  }

  const onClickAddItem = () => {
    const tableRates = [...TABLE_RATES];
    const newTableRate = generateNewItem();
    tableRates.push(newTableRate);
    setTableRates(tableRates);
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
                <div className="pr-2">Table Rates</div>
                <button className={`${ADMIN_ACTION_BUTTONS}`} onClick={onClickAddItem}>+1</button>
              </div>
              <div className="italic text-sm">Rates, minimums, player limits</div>
            </div>
            <div className={`${ADMIN_ACTIONS}`}>
              <button className={`${actionButtonStyles}`} onClick={onClickResetForm}>Reset</button>
              <button className={`${actionButtonStyles}`} onClick={() => {setShowConfirmSave(true)} }>Save</button>
            </div>
          </div>
        </div>
      </div>
      <div className={`${ADMIN_CONTENT}`}>
      {TABLE_RATES.map((tableRate: TableRate, index: number) => (
          <div className={`${tableRate.isActive? `${borderColor}`: '!border-gray-500 border-dashed opacity-50'} ${ITEM}`} key={tableRate.id}>
            <div className={`${ROW}`}>
              {(tableRate.id !== DEFAULT_ID) && (
                <div
                  className={`mr-2 ${!!tableRate.forDelete && 'text-rose-500 hover:text-red-800'} ${!!tableRate.forAdd && 'text-green-500 hover:text-green-800'} ${actionIconStyles}`}
                  onClick={(event) => {onClickForDeleteItem(tableRate)}}>
                  <TrashIcon></TrashIcon>
                </div>
              )}
              {(tableRate.id === DEFAULT_ID) && (
                <span>
                DEFAULT
                </span>
              )}
              {(tableRate.id !== DEFAULT_ID) && (
                <span>{index+1}</span>
              )}
              <div className={`text-nowrap ${!!tableRate.forDelete && 'text-rose-500'} ${!!tableRate.forAdd && 'text-green-500'}`}>
                <input
                  className={`
                    ${tableRate.id === DEFAULT_ID ? INPUT_FIELD_MED : INPUT_FIELD_LG}
                    ${formInputStyles}
                    ${!!tableRate.forDelete && 'text-rose-500'}
                    ${!!tableRate.forAdd && 'text-green-500'}
                    ${formFieldStyles}
                  `}
                  onChange={(event) => {
                    tableRate.name = event.target.value;
                    setTableRates([...TABLE_RATES]);
                  }}
                  value={tableRate.name}
                  maxLength={55}
                />
              </div>
            </div>
            {(tableRate.id !== DEFAULT_ID) && (
              <div className={`${ROW} mt-1`}>
                <div className={`w-[90px] text-sm text-nowrap ${formLabelLeftStyles} ${tableRate.isActive? 'text-yellow-500':''}`}>
                  ENABLED:
                </div>
                <input
                  type="checkbox"
                  className={`ml-2 size-4`}
                  checked={tableRate.isActive}
                  onChange={(event) => {
                    tableRate.isActive = !tableRate.isActive;
                    setTableRates([...TABLE_RATES]);
                  }}
                />
              </div>
            )}
            <div className={`${ROW} mt-1`}>
              <div className={`text-sm text-nowrap ${formLabelLeftStyles}`}>
                Base Rate:
              </div>
              <div className="inline-block">
                <input
                  className={`${formInputStylesSmall}`}
                  value={tableRate.tableRateRules.hourlyRate}
                  placeholder="Rate..."
                  maxLength={6}
                  onChange={(event) => {
                    tableRate.tableRateRules.hourlyRate = event.target.value.trim();
                    setTableRates([...TABLE_RATES]);
                  }}
                />
              </div>
            </div>
            <div className={`${ROW} mt-1`}>
              <div className={`w-[90px] text-sm text-nowrap ${formLabelLeftStyles} ${tableRate.tableRateRules.isFlatRate? '!text-cyan-500':''}`}>
                Use Schedule:
              </div>
              <input
                type="checkbox"
                className={`ml-2 size-4`}
                checked={tableRate.tableRateRules.useRateSchedule}
                onChange={(event) => {
                  tableRate.tableRateRules.useRateSchedule = !tableRate.tableRateRules.useRateSchedule;
                  setTableRates([...TABLE_RATES]);
                }}
              />
            </div>
            {tableRate.tableRateRules.useRateSchedule && (<>
              <div className={`${ROW} ml-8 mt-1`}>
                <select
                  name="rateSchedule"
                  onChange={(event) => {
                    tableRate.tableRateRules.rateScheduleId = Number(event.target.value.trim());
                    setTableRates([...TABLE_RATES]);
                  }}
                  value={tableRate.tableRateRules.rateScheduleId}
                  className={`${formSelectStyles} pb-3`}
                >
                  {APP_STATE.rateSchedules.map((schedule) => (
                    <option key={schedule.id} className={optionStyles} value={schedule.id}>{schedule.name}</option>
                  ))}
                </select>
              </div>
            </>)}
            <div className={`${ROW} mt-1`}>
              <div className={`w-[90px] text-sm text-nowrap ${formLabelLeftStyles} ${tableRate.tableRateRules.isFlatRate? '!text-cyan-500':''}`}>
                Use Flat Rate:
              </div>
              <input
                type="checkbox"
                className={`ml-2 size-4`}
                checked={tableRate.tableRateRules.isFlatRate}
                onChange={(event) => {
                  tableRate.tableRateRules.isFlatRate = !tableRate.tableRateRules.isFlatRate;
                  setTableRates([...TABLE_RATES]);
                }}
              />
            </div>
            <div className={`${ROW} mt-1`}>
              <div className={`w-[90px] text-sm text-nowrap ${formLabelLeftStyles}`}>
                Min 1 hr:
              </div>
              <input
                type="checkbox"
                className="ml-2 size-4"
                checked={tableRate.tableRateRules.isOneHourMinimum}
                onChange={(event) => {
                  tableRate.tableRateRules.isOneHourMinimum = !tableRate.tableRateRules.isOneHourMinimum;
                  setTableRates([...TABLE_RATES]);
                }}
              />
            </div>
            <div className={`${ROW} mt-1`}>
              <div className={`w-[90px] text-sm text-nowrap ${formLabelLeftStyles}`}>
                Per Player:
              </div>
              <input
                type="checkbox"
                className="ml-2 size-4"
                checked={tableRate.tableRateRules.isChargePerPlayer}
                onChange={(event) => {
                  tableRate.tableRateRules.isChargePerPlayer = !tableRate.tableRateRules.isChargePerPlayer;
                  setTableRates([...TABLE_RATES]);
                }}
              />
            </div>
            {tableRate.tableRateRules.isChargePerPlayer && (<>
              <div className={`${ROW} ml-8 mt-1`}>
                <div className={`${formLabelLeftStyles}`}>
                  Player limit:
                </div>
                <select
                  name="partySize"
                  onChange={(event) => {
                    tableRate.playerRateRules.playerLimit = Number(event.target.value.trim());
                    setTableRates([...TABLE_RATES]);
                  }}
                  value={tableRate.playerRateRules.playerLimit}
                  className={`${formSelectStyles} pb-3`}
                >
                  {PARTY_SIZE_ARRAY.map((size) => (
                    <option key={size} className={optionStyles} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className={`${ROW} ml-8 mt-1`}>
                <div className={`${formLabelLeftStyles}`}>
                  Rate after limit:
                </div>
                <input
                  value={tableRate.playerRateRules.afterLimitRate}
                  maxLength={6}
                  className={`${formInputStylesSmall}`}
                  placeholder="Rate..."
                  onChange={(event) => {
                    tableRate.playerRateRules.afterLimitRate = event.target.value.trim();
                    setTableRates([...TABLE_RATES]);
                  }}
                />
              </div>
            </>)}
          </div>
        ))}
      </div>
    </div>
    <ModalConfirm
      show={SHOW_CONFIRM_SAVE}
      dialogTitle={`SAVE TABLE RATES`}
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
