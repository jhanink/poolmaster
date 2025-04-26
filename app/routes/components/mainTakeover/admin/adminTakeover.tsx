import { useEffect, useState, useRef } from "react";
import { ArrowRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { appStateAtom, mainTakoverAtom } from "~/appStateGlobal/atoms";
import type { Account, Billing, TableItemData } from "~/config/AppState";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles, actionIconStyles, formFieldStyles, optionStyles } from "~/util/GlobalStylesUtil";
import ModalConfirm from "../../ui-components/modal/modalConfirm";
import { fragmentWelcomeMessage, fragmentAppName, fragmentExitTakeover } from "../../fragments/fragments";

const SECTION = `text-left`;
const HEADER = `text-2xl py-2 px-5 text-purple-500 mx-2 border border-gray-800 rounded-lg w-full`;
const CONTENT = `p-5 text-sm `;
const ACTIONS = `text-left`;
const actionButtons = `${actionButtonStyles} !py-0`

export default function AdminTakeover() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [, setMainTakeover] = useAtom(mainTakoverAtom);
  const [TABLES, setTables] = useState([] as TableItemData[]);
  const [ACCOUNT, setAccount] = useState({venue: ''} as Account);
  const [BILLING, setBilling] = useState({defaultBillingRate: ''} as Billing);
  const [SHOW_CONFIRM_SAVE_TABLES, setShowConfirmSaveTables] = useState(false);

  const TopRef = useRef<HTMLDivElement>(null);

  const onClickExit = () => {
    setMainTakeover(undefined);
  }

  const onClickResetTables = (event: any) => {
    const tables = APP_STATE.tables.map((table: TableItemData ) => ({...table}));
    setTables(tables);
  }

  const onClickResetAccount = (event: any) => {
    setAccount({...APP_STATE.account});
  }

  const onClickResetBilling = (event: any) => {
    setBilling({...APP_STATE.billing});
  }

  const onClickSaveTables = () => {
    const tables = TABLES
      .map((table: TableItemData) => ({...table, forAdd: false}))
      .filter((table: TableItemData) => !table.forDelete);

    const newState = {
      ...APP_STATE,
      tables,
    }

    AppStorage.setAppStateRemote(newState);
    setAppState(newState);
    setTables(tables);
    setShowConfirmSaveTables(false);
  }

  const onClickSaveAccount = (event: any) => {
    const newState = {
      ...APP_STATE,
      account: ACCOUNT,
    }
    AppStorage.setAppStateRemote(newState);
    setAppState(newState);
  }

  const onClickSaveBilling = (event: any) => {
    const newState = {
      ...APP_STATE,
      billing: BILLING,
    }
    AppStorage.setAppStateRemote(newState);
    setAppState(newState);
  }

  const onClickForDelete = (table: TableItemData) => {
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
    const newTable: TableItemData = {
      id,
      number,
      name: `Table ${number}`,
      type: 'Regulation',
      tableRate: `${BILLING.defaultBillingRate}`,
      isActive: true,
      forDelete: false,
      forAdd: true,
    };
    return newTable;
  }

  useEffect(() => {
    onClickResetTables({} as any);
    onClickResetAccount({} as any);
    onClickResetBilling({} as any);
    TopRef.current && TopRef.current.scrollIntoView();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center text-center" ref={TopRef}>
      {!!APP_STATE.modifiedAt && (
        fragmentExitTakeover(onClickExit)
      )}
      <div className="CONTENT pt-5 relative">
        {!APP_STATE.modifiedAt && (
          fragmentWelcomeMessage()
        )}
        <div>
          {!!APP_STATE.modifiedAt && (
            <h1>{fragmentAppName('text-2xl ml-2')}</h1>
          )}
          <h1 className="text-2xl text-gray-300 pb-10 pt-3">Admin Console</h1>
        </div>
        <div className="text-center mb-20">
          <div className={`${SECTION}`}>
            <div className={`${HEADER}`}>
              <span className="pr-5">Tables</span>
              <button className={actionButtons} onClick={() => {onClickAddTables(1)}}>+1</button>
              <button className={actionButtons} onClick={() => {onClickAddTables(3)}}>+3</button>
              <button className={actionButtons} onClick={() => {onClickAddTables(10)}}>+10</button>
            </div>
            <div className={`${CONTENT}`}>
              {TABLES.map((table: TableItemData, index: number) => (
                <div className="mb-3" key={table.id}>
                  <div className={`flex items-center`}>
                    <div className={`mr-2 ${!!table.forDelete && 'text-red-500 hover:text-red-800'} ${!!table.forAdd && 'text-green-500 hover:text-green-800'} ${actionIconStyles}`}
                    onClick={(event) => {onClickForDelete(table)}}>
                      <TrashIcon></TrashIcon>
                    </div>
                    <div className={`whitespace-nowrap ${!!table.forDelete && 'text-red-500'} ${!!table.forAdd && 'text-green-500'}`}>
                      {index+1} <input
                        className={`w-[150px] ${!!table.forDelete && 'text-red-500'} ${!!table.forAdd && 'text-green-500'} ${formFieldStyles}`}
                        value={table.name}
                        placeholder="Table name..."
                        maxLength={30}
                        onChange={(event) => {
                          table.name = event.target.value;
                          setTables([...TABLES]);
                        }}
                        />
                    </div>
                    <div className={`flex-1 ml-2`}>
                      <select
                        name="tableType"
                        onChange={(event) =>{
                          table.type = event.target.value;
                          setTables([...TABLES]);
                        }}
                        value={table.type}
                        className={`uppercase bg-transparent pb-3
                        ${formFieldStyles}`}
                      >
                        <option className={optionStyles} value="Regulation">Regulation</option>
                        <option className={optionStyles} value="Bar">Bar Table</option>
                        <option className={optionStyles} value="Pro">Pro Table</option>
                      </select>
                    </div>
                  </div>
                  <div className="ml-4 mt-1 flex items-center">
                    <div className="inline-block text-gray-400 mr-2">
                      Hourly Rate:
                    </div>
                    <div className="inline-block">
                      <input
                        className={`w-[90px] ${formFieldStyles}`}
                        value={table.tableRate}
                        placeholder="Rate..."
                        maxLength={6}
                        onChange={(event) => {
                          table.tableRate = event.target.value;
                          setTables([...TABLES]);
                        }}
                      />
                    </div>
                  </div>
                  {!!table.forDelete && table.guest && (
                    <div className="text-red-500 mt-2 mb-4 text-sm italic ml-10">
                      <ArrowRightIcon className="inline-block w-4 h-4 mr-1"></ArrowRightIcon>
                      <span className="uppercase">{table.guest.name}</span> is on {table.name}
                    </div>
                  )}
                </div>))}
            </div>
            <div className={`${ACTIONS}`}>
              <button className={`${actionButtonStyles}`} onClick={onClickResetTables}>Reset</button>
              <button className={`${actionButtonStyles}`} onClick={() => {setShowConfirmSaveTables(true)} }>Save</button>
            </div>
          </div>

          <hr className="text-gray-900 my-5"/>

          <div className={`${SECTION}`}>
            <h2 className={`${HEADER}`}>
              Account
            </h2>
            <div className={`${CONTENT}`}>
              <div>
                <span className="text-gray-400 mr-2">
                  Venue:
                </span>
                <input
                  className={`w-[200px] ${formFieldStyles}`}
                  value={ACCOUNT.venue}
                  placeholder="Account name..."
                  maxLength={50}
                  onChange={(event) => {
                    ACCOUNT.venue = event.target.value;
                    setAccount({...ACCOUNT});
                  }}
                />
              </div>
            </div>
            <div className={`${ACTIONS}`}>
              <button className={`${actionButtonStyles}`} onClick={onClickResetAccount}>Reset</button>
              <button className={`${actionButtonStyles}`} onClick={onClickSaveAccount}>Save</button>
            </div>
          </div>

          <hr className="text-gray-900 my-5"/>

          <div className={`${SECTION}`}>
            <h2 className={`${HEADER}`}>
              Billing
            </h2>
            <div className={`${CONTENT}`}>
              <div>
                <span className="text-gray-400 mr-2">
                  Max Billable Players:
                </span>
                <select
                  onChange={(event) => {
                    BILLING.maxBillablePlayers = Number(event.target.value);
                    setBilling({...BILLING})
                  }}
                  value={BILLING.maxBillablePlayers}
                  className={`${formFieldStyles}`}
                >
                  {[1,2,3,4,5].map((size) => (
                    <option key={size} className={optionStyles} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <span className="text-gray-400 mr-2">
                  Default Hourly Rate:
                </span>
                <input
                  value={BILLING.defaultBillingRate}
                  placeholder="Rate..."
                  maxLength={6}
                  className={`w-[100px] ${formFieldStyles}`}
                  onChange={(event) => {
                    BILLING.defaultBillingRate = event.target.value;
                    setBilling({...BILLING});
                  }}
                />
              </div>
            </div>
            <div className={`${ACTIONS}`}>
              <button className={`${actionButtonStyles}`} onClick={onClickResetBilling}>Reset</button>
              <button className={`${actionButtonStyles}`} onClick={onClickSaveBilling}>Save</button>
            </div>
          </div>
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
    </div>
  );
}
