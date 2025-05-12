import { DefaultTableTypeData, type TableType } from "~/config/AppState"
import { ADMIN_ACTION_BUTTONS, ADMIN_ACTIONS, ADMIN_CONTENT, ADMIN_HEADER, ADMIN_SECTION } from "./admin"
import { TrashIcon } from "@heroicons/react/24/outline"
import {
  actionButtonStyles,
  actionIconStyles,
  formFieldStyles,
  formInputStyles,
  formLabelLeftStyles,
  formSelectStyles,
  INPUT_FIELD,
  ITEM,
  optionStyles,
  ROW
} from "~/util/GlobalStylesUtil"
import ModalConfirm from "../../ui-components/modal/modalConfirm"
import { useAtom } from "jotai"
import { appStateAtom } from "~/appStateGlobal/atoms"
import { useEffect, useState } from "react"
import { AppStorage } from "~/util/AppStorage"

export default function AdminTableTypes() {

  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [TABLE_TYPES, setTableTypes] = useState([] as TableType[]);
  const [SHOW_CONFIRM_SAVE, setShowConfirmSave] = useState(false);

  const onClickResetForm = (event: any) => {
    const types = APP_STATE.tableTypes.map((type: TableType ) => ({...type}));
    setTableTypes(types);
  }

  const onClickSaveTableTypes = () => {
    const types = TABLE_TYPES
      .map((type: TableType) => ({...type, forAdd: false}))
      .filter((type: TableType) => !type.forDelete);

    const newState = {
      ...APP_STATE,
      tableTypes: types,
    }

    AppStorage.setAppStateRemote(newState);
    setAppState(newState);
    setTableTypes(types);
    setShowConfirmSave(false);
  }

  const generateNewItem = (index: number = 1) => {
    const id = Date.now() + index;
    const number = TABLE_TYPES.length + index;
    const newItem: TableType = {
      ...DefaultTableTypeData,
      id,
      name: ``,
      isActive: true,
      forDelete: false,
      forAdd: true,
    }
    return newItem;
  }

  const onClickForDeleteItem = (item: TableType) => {
    if (item.forAdd) {
      TABLE_TYPES.splice(TABLE_TYPES.indexOf(item), 1);
      setTableTypes([...TABLE_TYPES]);
      return;
    }
    item.forDelete = !item.forDelete;
    setTableTypes([...TABLE_TYPES]);
  }

  const onClickAddItem = () => {
    const tableTypes = [...TABLE_TYPES];
    const newItem = generateNewItem();
    tableTypes.push(newItem);
    setTableTypes(tableTypes);
  }

  useEffect(() => {
    onClickResetForm({} as any);
  }, []);

  return (<>
    <div className={`${ADMIN_SECTION}`}>
      <div className={`flex items-center ${ADMIN_HEADER}`}>
        <div className="pr-5">Table Types</div>
        <button className={`${ADMIN_ACTION_BUTTONS}`} onClick={onClickAddItem}>+1</button>
      </div>
      <div className={`${ADMIN_CONTENT}`}>
      {TABLE_TYPES.map((tableType: TableType, index: number) => (
          <div className={`${tableType.isActive? '!border-blue-500':'!border-gray-500 border-dashed'} ${ITEM}`} key={tableType.id}>
            <div className={`${ROW}`}>
              {(tableType.id !== DefaultTableTypeData.id) && (
                <div
                  className={`mr-2 ${!!tableType.forDelete && 'text-red-500 hover:text-red-800'} ${!!tableType.forAdd && 'text-green-500 hover:text-green-800'} ${actionIconStyles}`}
                  onClick={(event) => {onClickForDeleteItem(tableType)}}>
                  <TrashIcon></TrashIcon>
                </div>
              )}
              <div className={`whitespace-nowrap ${!!tableType.forDelete && 'text-red-500'} ${!!tableType.forAdd && 'text-green-500'}`}>
                {tableType.id === DefaultTableTypeData.id && (
                  "DEFAULT"
                )}
                {tableType.id !== DefaultTableTypeData.id && (
                  <span>{index+1}</span>
                )}
                <input
                  className={`w-full ${formInputStyles} ${INPUT_FIELD} ${!!tableType.forDelete && 'text-red-500'} ${!!tableType.forAdd && 'text-green-500'} ${formFieldStyles}`}
                  placeholder="Table Type..."
                  maxLength={55}
                  onChange={(event) => {
                    tableType.name = event.target.value;
                    setTableTypes([...TABLE_TYPES]);
                  }}
                  value={tableType.name}
                />
              </div>
            </div>
            <div className={`${ROW}`}>
              <div className="text-gray-400 mr-2">
                Rate:
              </div>
              <select
                onChange={(event) => {
                  tableType.tableRateId = Number(event.target.value);
                  setTableTypes([...TABLE_TYPES]);
                }}
                value={tableType.tableRateId}
                className={`grow ${formSelectStyles}`}
              >
                {APP_STATE.tableRates
                  .filter((tableRate) => tableRate.isActive)
                  .map((tableRate) => (
                    <option key={tableRate.id} className={optionStyles} value={tableRate.id}>{tableRate.name}</option>
                  ))
                }
              </select>
            </div>
            {(tableType.id !== DefaultTableTypeData.id) && (
              <div className={`${ROW} mt-1`}>
                <div className={`${formLabelLeftStyles} ${tableType.isActive? 'text-blue-500':''}`}>
                  ENABLED:
                </div>
                <input
                  type="checkbox"
                  className={`ml-2 size-4`}
                  checked={tableType.isActive}
                  onChange={(event) => {
                    tableType.isActive = !tableType.isActive;
                    setTableTypes([...TABLE_TYPES]);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={`${ADMIN_ACTIONS}`}>
        <button className={`${actionButtonStyles}`} onClick={onClickResetForm}>Reset</button>
        <button className={`${actionButtonStyles}`} onClick={() => {setShowConfirmSave(true)} }>Save</button>
      </div>
    </div>
    <ModalConfirm
      show={SHOW_CONFIRM_SAVE}
      dialogTitle={`SAVE TABLE TYPES`}
      dialogMessageFn={() => (
        <span className="text-base">
          <div className="mt-3 text-xl text-gray-200">Are you sure?</div>
        </span>
      )}
      onConfirm={() => {onClickSaveTableTypes()}}
      onCancel={() => {setShowConfirmSave(false)}}
    />
  </>)
}
