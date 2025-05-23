import { DefaultTableRateData, PARTY_SIZE_ARRAY, type TableRate } from "~/config/AppState";
import { ADMIN_ACTION_BUTTONS, ADMIN_ACTIONS, ADMIN_CONTENT, ADMIN_HEADER, ADMIN_SECTION } from "./admin";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  actionButtonStyles,
  actionIconStyles,
  formFieldStyles,
  formInputStyles,
  formInputStylesSmall,
  formLabelLeftStyles,
  formSelectStyles,
  INPUT_FIELD,
  ITEM,
  optionStyles,
  ROW
} from "~/util/GlobalStylesUtil";
import { useEffect, useState } from "react";
import ModalConfirm from "../../ui-components/modal/modalConfirm";
import { useAtom } from "jotai";
import { appStateAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";

export default function AdminTableRates() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [TABLE_RATES, setTableRates] = useState([] as TableRate[]);
  const [SHOW_CONFIRM_SAVE, setShowConfirmSave] = useState(false);

  const onClickResetForm = () => {
    if (!APP_STATE.tableRates.length) return;
    const tableRates = APP_STATE.tableRates.map((tableRate: TableRate) => ({...tableRate}));
    setTableRates(tableRates);
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
    <div className={`${ADMIN_SECTION}`}>
      <div className={`flex items-center ${ADMIN_HEADER}`}>
        <div className="pr-5">Table Rates</div>
        <button className={`${ADMIN_ACTION_BUTTONS}`} onClick={onClickAddItem}>+1</button>
      </div>
      <div className={`${ADMIN_CONTENT}`}>
      {TABLE_RATES.map((tableRate: TableRate, index: number) => (
          <div className={`!mx-1 ${tableRate.isActive? 'border-yellow-500': '!border-gray-500 border-dashed opacity-50'} ${ITEM}`} key={tableRate.id}>
            <div className={`${ROW}`}>
              {(tableRate.id !== DefaultTableRateData.id) && (
                <div
                  className={`mr-2 ${!!tableRate.forDelete && 'text-red-500 hover:text-red-800'} ${!!tableRate.forAdd && 'text-green-500 hover:text-green-800'} ${actionIconStyles}`}
                  onClick={(event) => {onClickForDeleteItem(tableRate)}}>
                  <TrashIcon></TrashIcon>
                </div>
              )}
              {(tableRate.id === DefaultTableRateData.id) && (
                "DEFAULT"
              )}
              {(tableRate.id !== DefaultTableRateData.id) && (
                <span>{index+1}</span>
              )}
              <div className={`text-nowrap ${!!tableRate.forDelete && 'text-red-500'} ${!!tableRate.forAdd && 'text-green-500'}`}>
                <input
                  className={`${formInputStyles} w-[250px] text-sm ${INPUT_FIELD} ${!!tableRate.forDelete && 'text-red-500'} ${!!tableRate.forAdd && 'text-green-500'} ${formFieldStyles}`}
                  onChange={(event) => {
                    tableRate.name = event.target.value;
                    setTableRates([...TABLE_RATES]);
                  }}
                  value={tableRate.name}
                  maxLength={55}
                />
              </div>
            </div>
            {(tableRate.id !== DefaultTableRateData.id) && (
              <div className={`${ROW} mt-1`}>
                <div className={`w-[80px] text-sm text-nowrap ${formLabelLeftStyles} ${tableRate.isActive? 'text-yellow-500':''}`}>
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
              <div className={`w-[80px] text-sm text-nowrap ${formLabelLeftStyles} ${tableRate.tableRateRules.isFlatRate? '!text-cyan-500':''}`}>
                Flat Rate:
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
              <div className={`w-[80px] text-sm text-nowrap ${formLabelLeftStyles}`}>
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
              <div className={`w-[80px] text-sm text-nowrap ${formLabelLeftStyles}`}>
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
      <div className={`!text-right ${ADMIN_ACTIONS}`}>
        <button className={`${actionButtonStyles}`} onClick={onClickResetForm}>Reset</button>
        <button className={`${actionButtonStyles}`} onClick={() => {setShowConfirmSave(true)} }>Save</button>
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
