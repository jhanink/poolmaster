import { DefaultTableItemData, type TableItem } from "~/config/AppState"
import { ADMIN_ACTION_BUTTONS, ADMIN_ACTIONS, ADMIN_CONTENT, ADMIN_HEADER, ADMIN_HEADER_STICKY, ADMIN_SECTION } from "./admin"
import { ArrowRightIcon, TrashIcon } from "@heroicons/react/24/outline"
import { actionButtonStyles, actionIconStyles, formInputStyles, formLabelLeftStyles, formSelectStyles, ITEM, optionStyles, ROW } from "~/util/GlobalStylesUtil"
import ModalConfirm from "../../ui-components/modal/modalConfirm"
import { useAtom } from "jotai"
import { appStateAtom } from "~/appStateGlobal/atoms"
import { useEffect, useState } from "react"
import { AppStorage } from "~/util/AppStorage"
import { Helpers } from "~/util/Helpers"

const sectionColor = 'green-500';

export default function AdminTables() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [TABLES, setTables] = useState([] as TableItem[]);
  const [SHOW_CONFIRM_SAVE, setShowConfirmSave] = useState(false);

  const onClickResetForm = () => {
    const tables = APP_STATE.tables.map((table: TableItem ) => ({...table}));
    setTables(tables);
  }

  const onClickSaveItem = () => {
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
    setShowConfirmSave(false);
  }

  const onClickForDeleteItem = (table: TableItem) => {
    if (table.forAdd) {
      TABLES.splice(TABLES.indexOf(table), 1);
      setTables([...TABLES]);
      return;
    }
    table.forDelete = !table.forDelete;
    setTables([...TABLES]);
  }

  const onClickAddItem = (num: 1 | 3 | 10) => {
    const nums = [1,2,3,4,5,6,7,8,9,10];
    const tnums = nums.slice(0,num);
    const tables = [...TABLES];
    tnums.forEach((index) => {
      const newTable = generateNewItem(index);
      tables.push(newTable);
    })
    setTables(tables);
  }

  const generateNewItem = (index: number = 1) => {
    const id = Date.now() + index;
    const number = TABLES.length + index;
    const newTable: TableItem = {
      ...DefaultTableItemData,
      id,
      number,
      name: `Table ${number}`,
    };
    return newTable;
  }

  useEffect(() => {
    onClickResetForm();
  }, []);

  return (<>
    <div className={`${ADMIN_SECTION}`}>
      <div className={`${ADMIN_HEADER_STICKY} border-${sectionColor}`}>
        <div className={`${ADMIN_HEADER} !bg-${sectionColor}`}>
          <div className={`flex items-center`}>
            <div className="pr-5">Tables</div>
            <button className={ADMIN_ACTION_BUTTONS} onClick={() => {onClickAddItem(1)}}>+1</button>
            <button className={ADMIN_ACTION_BUTTONS} onClick={() => {onClickAddItem(3)}}>+3</button>
            <button className={ADMIN_ACTION_BUTTONS} onClick={() => {onClickAddItem(10)}}>+10</button>
          </div>
        </div>
        <div className={`${ADMIN_ACTIONS}`}>
          <button className={`${actionButtonStyles}`} onClick={onClickResetForm}>Reset</button>
          <button className={`${actionButtonStyles}`} onClick={() => {setShowConfirmSave(true)} }>Save</button>
        </div>
      </div>
      <div className={`${ADMIN_CONTENT}`}>
        {TABLES.map((table: TableItem, index: number) => (
          <div className={`!mx-1 ${table.isActive? `!border-${sectionColor}`:'!border-gray-500 border-dashed opacity-50'} ${ITEM}`} key={table.id}>
            <div className={`text-nowrap ${ROW}`}>
              <div className={`mr-2 ${!!table.forDelete && 'text-red-500 hover:text-red-800'} ${!!table.forAdd && 'text-green-500 hover:text-green-800'} ${actionIconStyles}`}
              onClick={(event) => {onClickForDeleteItem(table)}}>
                <TrashIcon></TrashIcon>
              </div>
              <div className={`grow pr-3 ${!!table.forDelete && 'text-red-500'} ${!!table.forAdd && 'text-green-500'}`}>
                {index+1}
                <input
                  className={`
                    uppercase ml-2 !w-[270px]
                    ${formInputStyles}
                     ${!!table.forDelete && 'text-red-500'}
                     ${!!table.forAdd && 'text-green-500'}
                  `}
                  placeholder="Table name..."
                  maxLength={30}
                  onChange={(event) => {
                    table.name = event.target.value;
                    setTables([...TABLES]);
                  }}
                  value={table.name}
                  />
              </div>
            </div>
            <div className={`${ROW}`}>
              <div className={`${formLabelLeftStyles} ${table.isActive? 'text-green-500':''}`}>
                ENABLED:
              </div>
              <input
                type="checkbox"
                className={`ml-2 size-4`}
                checked={table.isActive}
                onChange={(event) => {
                  table.isActive = !table.isActive;
                  setTables([...TABLES]);
                }}
              />
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
              <div className={`${formLabelLeftStyles}`}>
                Ignore Table Type Rate:
              </div>
              <input
                type="checkbox"
                className={`ml-2 size-4`}
                checked={table.ignoreTableTypeRate}
                onChange={(event) => {
                  table.ignoreTableTypeRate = !table.ignoreTableTypeRate;
                  setTables([...TABLES]);
                }}
              />
            </div>
            {table.ignoreTableTypeRate && (
              <div className={`ml-8 ${ROW}`}>
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
                    .filter((tableRate) => tableRate.isActive)
                    .map((tableRate) => (
                      <option key={tableRate.id} className={optionStyles} value={tableRate.id}>{tableRate.name} {Helpers.tableRateSuffix(tableRate)}</option>
                    ))
                  }
                </select>
              </div>
            )}
            {!!table.forDelete && table.guest && (
              <div className="text-red-500 mt-2 mb-4 text-sm italic ml-10">
                <ArrowRightIcon className="inline-block w-4 h-4 mr-1"></ArrowRightIcon>
                <span className="uppercase">{table.guest.name}</span> is on {table.name}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    <ModalConfirm
      show={SHOW_CONFIRM_SAVE}
      dialogTitle={`SAVE TABLES`}
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
