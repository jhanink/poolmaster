import { DefaultTableRateData, type TableRate } from "~/config/AppState";
import { ADMIN_ACTION_BUTTONS, ADMIN_ACTIONS, ADMIN_CONTENT, ADMIN_HEADER, ADMIN_SECTION } from "./admin";
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

export default function AdminTableRates() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [SHOW_CONFIRM_SAVE_TABLE_RATES, setShowConfirmSaveTableRates] = useState(false);
  const [TABLE_RATES, setTableRates] = useState([DefaultTableRateData] as TableRate[]);

  const onClickSaveTableRates = () => {
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
    setShowConfirmSaveTableRates(false);
  }

  const generateNewTableRate = (index: number = 1) => {
    const id = Date.now() + index;
    const number = TABLE_RATES.length + index;
    const newTableRate: TableRate = {
      ...DefaultTableRateData,
      id,
      name: `Rate ${number}`,
    }
    return newTableRate;
  }

  const onClickResetTableRates = (event: any) => {
    if (!APP_STATE.tableRates.length) return;
    const tableRates = APP_STATE.tableRates.map((tableRate: TableRate) => ({...tableRate}));
    setTableRates(tableRates);
  }

  const onClickForDeleteTableRate = (tableRate: TableRate) => {
    if (tableRate.forAdd) {
      TABLE_RATES.splice(TABLE_RATES.indexOf(tableRate), 1);
      setTableRates([...TABLE_RATES]);
      return;
    }
    tableRate.forDelete = !tableRate.forDelete;
    setTableRates([...TABLE_RATES]);
  }

  const onClickAddTableRate = () => {
    const tableRates = [...TABLE_RATES];
    const newTableRate = generateNewTableRate();
    tableRates.push(newTableRate);
    setTableRates(tableRates);
  }

  useEffect(() => {
    onClickResetTableRates({} as any);
  }, []);

  return (<>
    <div className={`${ADMIN_SECTION}`}>
      <div className={`flex items-center ${ADMIN_HEADER}`}>
        <div className="pr-5">Table Rates</div>
        <button className={`${ADMIN_ACTION_BUTTONS}`} onClick={onClickAddTableRate}>+1</button>
      </div>
      <div className={`${ADMIN_CONTENT}`}>
      {TABLE_RATES.map((tableRate: TableRate, index: number) => (
          <div className={`${tableRate.isActive? 'border-yellow-500': '!border-gray-500 border-dashed'} ${ITEM}`} key={tableRate.id}>
            <div className={`${ROW}`}>
              {(tableRate.id !== DefaultTableRateData.id) && (
                <div
                  className={`mr-2 ${!!tableRate.forDelete && 'text-red-500 hover:text-red-800'} ${!!tableRate.forAdd && 'text-green-500 hover:text-green-800'} ${actionIconStyles}`}
                  onClick={(event) => {onClickForDeleteTableRate(tableRate)}}>
                  <TrashIcon></TrashIcon>
                </div>
              )}
              {(tableRate.id === DefaultTableRateData.id) && (
                "DEFAULT"
              )}
              {(tableRate.id !== DefaultTableRateData.id) && (
                <span>{index+1}</span>
              )}
              <div className={`whitespace-nowrap  ${!!tableRate.forDelete && 'text-red-500'} ${!!tableRate.forAdd && 'text-green-500'}`}>
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
                <div className={`${formLabelLeftStyles} ${tableRate.isActive? 'text-yellow-500':''}`}>
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
              <div className={`${formLabelLeftStyles}`}>
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
              <div className={`${formLabelLeftStyles}`}>
                1 hour minimum?
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
              <div className={`${formLabelLeftStyles}`}>
                Per player?
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
                  Player Limit:
                </div>
                <input
                  type="number"
                  value={tableRate.playerRateRules.playerLimit}
                  maxLength={2}
                  min={0}
                  max={99}
                  className={`${formInputStylesExtraSmall}`}
                  onChange={(event) => {
                    tableRate.playerRateRules.playerLimit = Number(event.target.value.trim());
                    setTableRates([...TABLE_RATES]);
                  }}
                />
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
      <div className={`${ADMIN_ACTIONS}`}>
        <button className={`${actionButtonStyles}`} onClick={onClickResetTableRates}>Reset</button>
        <button className={`${actionButtonStyles}`} onClick={() => {setShowConfirmSaveTableRates(true)} }>Save</button>
      </div>
    </div>
    <ModalConfirm
      show={SHOW_CONFIRM_SAVE_TABLE_RATES}
      dialogTitle={`SAVE TABLE RATES`}
      dialogMessageFn={() => (
        <span className="text-base">
          <div className="mt-3 text-xl text-gray-200">Are you sure?</div>
        </span>
      )}
      onConfirm={() => {onClickSaveTableRates()}}
      onCancel={() => {setShowConfirmSaveTableRates(false)}}
    />
  </>)
}
