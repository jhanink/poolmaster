import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { appStateAtom, isSavingAtom, mainTakoverAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { DEFAULT_ID, type TableItem, type TableType } from "~/config/AppState";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles, buttonHoverRing, tableChipsStyle } from "~/util/GlobalStylesUtil";
import { Helpers } from "~/util/Helpers";
import { fragmentExitTakeover } from "../../fragments/fragments";
import ModalConfirm from "../../ui-components/modal/modalConfirm";

export default function AssignTable() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [, setSelectedTable] = useAtom(selectedTableAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);
  const [ASSIGNED_TABLE, setAssignedTable] = useState<TableItem | undefined>(undefined);
  const [SHOW_CONFIRM_DELETE, setShowConfirmDelete] = useState(false);
  const [SAVING, setSaving] = useAtom(isSavingAtom);

  const TopRef = useRef<HTMLDivElement>(null);
  const tables = Helpers.tablesAvailable(APP_STATE);
  const guest = MAIN_TAKEOVER.assignTableGuest;

  const [TABLE_TYPE_ID, setTableTypeId] = useState((!guest.prefersTable && guest.tableOrTableTypeId) || DEFAULT_ID);

  const onClickTableChip = async (event: React.MouseEvent<HTMLButtonElement>, table: TableItem) => {
    event.stopPropagation();
    event.preventDefault();
    const tableId = table.id
    const guestId = MAIN_TAKEOVER.assignTableGuest?.id || 0;
    const assignedAt = new Date().getTime();
    setSaving(true);
    const newAppState = await AppStorage.assignToTableRemote({tableId, guestId, assignedAt});
    setSaving(false);
    setAppState(newAppState);
    exit();
  }

  const onClickReturnToGuestList = () => {
    setShowConfirmDelete(prev => true);
  }

  const returnToGuestList = async () => {
    const assignedTable = APP_STATE.tables.find((table: TableItem) => table.guest?.id === MAIN_TAKEOVER.assignTableGuest.id);
    assignedTable.guest = undefined;
    const guest = MAIN_TAKEOVER.assignTableGuest;
    guest.assignedAt = undefined;
    guest.closedOutAt = undefined;

    const guestList = [
      ...APP_STATE.guestList,
      {...guest}
    ];

    const newAppState = {
      ...APP_STATE,
      guestList,
    }

    AppStorage.setAppStateRemote(newAppState);
    setAppState(newAppState);
    exit();
  }

  const exit = () => {
    setSelectedTable(undefined);
    setMainTakeover(undefined);
  }

  const fragmentTableOrTypeList = () => {
    const isTablePreference = guest.prefersTable;
    const types: TableType[] = APP_STATE.tableTypes;
    return <>
      {isTablePreference ? (
        <span>{Helpers.getTable(APP_STATE, guest.tableOrTableTypeId).name}</span>
      ) : (
        <select className="text-center uppercase hover:cursor-pointer"
          value={TABLE_TYPE_ID}
          onChange={(event) => {
            setTableTypeId(Number(event.target.value));
          }}>
            <option value={-1}> → Show All</option>
            {types.map((item: TableType) => {
              return <option key={item.id} value={item.id}>{item.name}</option>
            })}
        </select>
      )}
    </>
  }

  useEffect(() => {
    TopRef.current && TopRef.current.scrollIntoView();
    const assignedTable = APP_STATE.tables.find((table: TableItem) => table.guest?.id === MAIN_TAKEOVER.assignTableGuest.id);
    setAssignedTable(assignedTable);
  }, []);

  return (<>
    <div className="select-none flex flex-col justify-center items-center" ref={TopRef}>
      {fragmentExitTakeover(exit)}
      <div className="border border-gray-800 rounded-xl py-3 mt-2 text-center min-w-[300px] max-w-[768px]">
        <div className="CONTENT">
          {!tables.length && <>
            <div className="text-gray-500 text-sm p-3 uppercase">
              No open tables available
            </div>
            <button className={`${actionButtonStyles}`} onClick={exit}>Exit</button>
          </>}
          {!!tables.length && <>
            <div className="flex flex-wrap items-center gap-3 justify-center mb-2">
              <div className="text-gray-300 uppercase text-2xl">
                {!!MAIN_TAKEOVER?.assignTableGuest?.assignedAt && (
                  <span>Move</span>
                )}
                {!MAIN_TAKEOVER?.assignTableGuest?.assignedAt && (
                  <span>Assign</span>
                )}
              </div>
              <div className={`${guest.assignedAt ? 'text-green-500' : 'text-blue-500' } uppercase text-xl`}>
                  | {MAIN_TAKEOVER.assignTableGuest?.name}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-sm italic">
                to an open table
                {!guest.assignedAt && (
                  <div className="my-5 text-gray-300 text-base flex items-center justify-center gap-1">
                    <div className={`inline-block p-2 px-6 ${guest.prefersTable && '!border-green-600'} border border-gray-700 rounded-lg`}>
                      <span className="text-gray-500">Prefers:</span> {fragmentTableOrTypeList()}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={`mt-5 mx-2 flex flex-wrap gap-2 justify-center`}>
              {tables
                .filter((table: TableItem) => {
                  return guest.assignedAt || guest.prefersTable || (table.tableTypeId === TABLE_TYPE_ID) || TABLE_TYPE_ID === -1;
                })
                .sort((A: TableItem, B: TableItem) =>
                  A.number - B.number
                )
                .map((table: TableItem) =>
                  <button
                    disabled={SAVING}
                    className={`CHIP ${tableChipsStyle} uppercase !m-0 !border-gray-800 hover:cursor-pointer ${buttonHoverRing}`}
                    key={table.id}
                    data-table-id={table.id}
                    onClick={(event) => onClickTableChip(event, table)}
                  >
                    <div className="">{table.name}</div>
                    {APP_STATE.adminSettings.showTableChipInfo && (
                      <div className="text-gray-700 italic text-[10px]">{Helpers.getTableType(APP_STATE, table.tableTypeId).name}</div>
                    )}
                  </button>
                )
              }
            </div>
            {ASSIGNED_TABLE && (<>
              <div className="my-5 text-gray-500 text-base">
                OR
              </div>
              <button disabled={SAVING} className={`!text-gray-500 !text-sm ${actionButtonStyles}`} onClick={onClickReturnToGuestList}>
                Back to Wait List
              </button>
            </>)}
          </>}
        </div>
      </div>
    </div>
    <ModalConfirm
      show={SHOW_CONFIRM_DELETE}
      dialogTitle={`CONFIRM - MOVE`}
      dialogMessageFn={() => <span className="text-sm">
        Move Guest
        <span className="text-blue-500 font-bold mx-2">{ASSIGNED_TABLE.guest.name.toUpperCase()}</span>
        back to the Wait List?
      </span>}
      onConfirm={returnToGuestList}
      onCancel={() => {setShowConfirmDelete(false); exit()}}
    />
  </>);
}
