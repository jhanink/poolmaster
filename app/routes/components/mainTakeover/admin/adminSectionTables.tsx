import { DEFAULT_TABLE_RATE_ID, DefaultTableTypeData, type TableItem } from "~/config/AppState"
import { ADMIN_ACTION_BUTTONS, ADMIN_ACTIONS, ADMIN_CONTENT, ADMIN_HEADER, ADMIN_SECTION } from "./adminTakeover"
import { ArrowRightIcon, TrashIcon } from "@heroicons/react/24/outline"
import { actionButtonStyles, actionIconStyles, formInputStyles, formSelectStyles, ITEM, optionStyles, ROW } from "~/util/GlobalStylesUtil"
import ModalConfirm from "../../ui-components/modal/modalConfirm"
import { useAtom } from "jotai"
import { appStateAtom } from "~/appStateGlobal/atoms"
import { useEffect, useState } from "react"
import { AppStorage } from "~/util/AppStorage"

export default function AdminSectionTables() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [TABLES, setTables] = useState([] as TableItem[]);
  const [SHOW_CONFIRM_SAVE_TABLES, setShowConfirmSaveTables] = useState(false);

  const onClickResetTables = (event: any) => {
    const tables = APP_STATE.tables.map((table: TableItem ) => ({...table}));
    setTables(tables);
  }

  const onClickSaveTables = () => {
    const tables = TABLES
      .map((table: TableItem) => ({...table, forAdd: false}))
      .filter((table: TableItem) => !table.forDelete);

    const newState = {
      ...APP_STATE,
      tables,
    }

    AppStorage.setAppStateRemote(newState);
    setAppState(newState);
    setTables(tables);
    setShowConfirmSaveTables(false);
  }

  const onClickForDeleteTable = (table: TableItem) => {
    if (table.forAdd) {
      TABLES.splice(TABLES.indexOf(table), 1);
      setTables([...TABLES]);
      return;
    }
    table.forDelete = !table.forDelete;
    setTables([...TABLES]);
  }

  const onClickAddTables = (num: 1 | 3 | 10) => {
    const nums = [1,2,3,4,5,6,7,8,9,10];
    const tnums = nums.slice(0,num);
    const tables = [...TABLES];
    tnums.forEach((index) => {
      const newTable = generateNewTable(index);
      tables.push(newTable);
    })
    setTables(tables);
  }

  const generateNewTable = (index: number = 1) => {
    const id = Date.now() + index;
    const number = TABLES.length + index;
    const newTable: TableItem = {
      id,
      number,
      name: `Table ${number}`,
      tableTypeId: DefaultTableTypeData.id,
      tableRateId: DEFAULT_TABLE_RATE_ID,
      isActive: true,
      forDelete: false,
      forAdd: true,
    };
    return newTable;
  }

  useEffect(() => {
    onClickResetTables({} as any);
  }, []);

  return (<>
    <div className={`${ADMIN_SECTION}`}>
      <div className={`${ROW} ${ADMIN_HEADER}`}>
        <div className="pr-5">Tables</div>
          <button className={ADMIN_ACTION_BUTTONS} onClick={() => {onClickAddTables(1)}}>+1</button>
          <button className={ADMIN_ACTION_BUTTONS} onClick={() => {onClickAddTables(3)}}>+3</button>
          <button className={ADMIN_ACTION_BUTTONS} onClick={() => {onClickAddTables(10)}}>+10</button>
      </div>
      <div className={`${ADMIN_CONTENT}`}>
        {TABLES.map((table: TableItem, index: number) => (
          <div className={`${ITEM}`} key={table.id}>
            <div className={`whitespace-nowrap ${ROW}`}>
              <div className={`mr-2 ${!!table.forDelete && 'text-red-500 hover:text-red-800'} ${!!table.forAdd && 'text-green-500 hover:text-green-800'} ${actionIconStyles}`}
              onClick={(event) => {onClickForDeleteTable(table)}}>
                <TrashIcon></TrashIcon>
              </div>
              <div className={`grow pr-3 ${!!table.forDelete && 'text-red-500'} ${!!table.forAdd && 'text-green-500'}`}>
                {index+1}
                <input
                  className={`ml-2 ${formInputStyles} w-full ${!!table.forDelete && 'text-red-500'} ${!!table.forAdd && 'text-green-500'}`}
                  value={table.name}
                  placeholder="Table name..."
                  maxLength={30}
                  onChange={(event) => {
                    table.name = event.target.value;
                    setTables([...TABLES]);
                  }}
                  />
              </div>
            </div>
            <div className={`${ROW}`}>
              <div className="text-gray-400 mr-2">
                Type:
              </div>
              <select
                name="tableType"
                onChange={(event) =>{
                  table.tableTypeId = Number(event.target.value);
                  setTables([...TABLES]);
                }}
                value={table.tableTypeId}
                className={`grow ${formSelectStyles} bg-transparent pb-3`}
              >
                {APP_STATE.tableTypes
                  .filter((type) => type.isActive)
                  .map((type) => (
                    <option key={type.id} className={optionStyles} value={type.id}>{type.name}</option>
                  ))
                }
              </select>
            </div>
            <div className={`${ROW}`}>
              <div className="text-gray-400 mr-2">
                Rate:
              </div>
              <select
                onChange={(event) => {
                  table.tableRateId = Number(event.target.value);
                  setTables([...TABLES]);
                }}
                value={table.tableRateId}
                className={`grow ${formSelectStyles}`}
              >
                {APP_STATE.tableRates
                  .filter((schedule) => schedule.isActive)
                  .map((schedule) => (
                    <option key={schedule.id} className={optionStyles} value={table.tableRateId}>{schedule.name}</option>
                  ))
                }
              </select>
            </div>
            {!!table.forDelete && table.guest && (
              <div className="text-red-500 mt-2 mb-4 text-sm italic ml-10">
                <ArrowRightIcon className="inline-block w-4 h-4 mr-1"></ArrowRightIcon>
                <span className="uppercase">{table.guest.name}</span> is on {table.name}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={`${ADMIN_ACTIONS}`}>
        <button className={`${actionButtonStyles}`} onClick={onClickResetTables}>Reset</button>
        <button className={`${actionButtonStyles}`} onClick={() => {setShowConfirmSaveTables(true)} }>Save</button>
      </div>
    </div>
    <ModalConfirm
      show={SHOW_CONFIRM_SAVE_TABLES}
      dialogTitle={`SAVE TABLES`}
      dialogMessageFn={() => (
        <span className="text-base">
          <div className="mt-3 text-xl text-gray-200">Are you sure?</div>
        </span>
      )}
      onConfirm={() => {onClickSaveTables()}}
      onCancel={() => {setShowConfirmSaveTables(false)}}
    />
  </>)
}
