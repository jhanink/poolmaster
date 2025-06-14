import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { appStateAtom, isSavingAtom, mainTakoverAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { type TableItem } from "~/config/AppState";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles, buttonHoverRing } from "~/util/GlobalStylesUtil";
import { Helpers } from "~/util/Helpers";
import { fragmentExitTakeover } from "../../fragments/fragments";

const unassignedStyle = `inline-block m-1 mb-2 rounded-full py-1 px-4 text-xs border border-gray-800 text-gray-600 font-bold hover:cursor-pointer`;

export default function AssignTable() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [, setSelectedTable] = useAtom(selectedTableAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);
  const [ASSIGNED_TABLE, setAssignedTable] = useState<TableItem | undefined>(undefined);
  const [SAVING, setSaving] = useAtom(isSavingAtom);

  const TopRef = useRef<HTMLDivElement>(null);
  const tables = APP_STATE.tables.filter((table: TableItem) => table.isActive);

  const onClickTableChip = async (event: React.MouseEvent<HTMLButtonElement>, table: TableItem) => {
    event.stopPropagation();
    event.preventDefault();
    const tableId = table.id
    const guestId = MAIN_TAKEOVER.assignTable?.id || 0;
    const assignedAt = new Date().getTime();
    setSaving(true);
    const newAppState = await AppStorage.assignToTableRemote({tableId, guestId, assignedAt});
    setSaving(false);
    setAppState(newAppState);
    exit();
  }

  const returnToGuestList = async () => {
    const assignedTable = APP_STATE.tables.find((table: TableItem) => table.guest?.id === MAIN_TAKEOVER.assignTable.id);
    assignedTable.guest = undefined;
    const guest = MAIN_TAKEOVER.assignTable;
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

  useEffect(() => {
    TopRef.current && TopRef.current.scrollIntoView();
    const assignedTable = APP_STATE.tables.find((table: TableItem) => table.guest?.id === MAIN_TAKEOVER.assignTable.id);
    setAssignedTable(assignedTable);
  }, []);

  return (
    <div className="select-none flex justify-center" ref={TopRef}>
      <div>
        {fragmentExitTakeover(exit)}
        <div className="border border-red-500 rounded-xl py-5 text-center">
          <div className="CONTENT">
            {!Helpers.tablesAvailable(APP_STATE).length && <>
              <div className="text-gray-500 text-sm p-3 uppercase">
                No open tables available
              </div>
              <button className={`${actionButtonStyles}`} onClick={exit}>Exit</button>
            </>}
            {!!Helpers.tablesAvailable(APP_STATE).length && <>
              <div className="text-2xl">
                <div className="text-gray-300 uppercase">
                  {!!MAIN_TAKEOVER?.assignTable?.assignedAt && (
                    <span>Move</span>
                  )}
                  {!MAIN_TAKEOVER?.assignTable?.assignedAt && (
                    <span>Assign</span>
                  )}
                </div>
                <div className="uppercase text-rose-500 mx-3 my-2 text-nowrap">
                  {MAIN_TAKEOVER.assignTable?.name}
                </div>
                <div className="text-gray-500 text-base">
                  to an open table
                </div>
              </div>
              <div className={`mt-5`}>
                {
                  tables
                    .filter((table: TableItem) => !table.guest)
                    .sort((A: TableItem, B: TableItem) =>
                      A.number - B.number
                    )
                    .map((table: TableItem) =>
                      <button
                        disabled={SAVING}
                        className={`CHIP ${unassignedStyle} ${buttonHoverRing}`}
                        key={table.id}
                        data-table-id={table.id}
                        onClick={(event) => onClickTableChip(event, table)}
                      >
                        <div className="uppercase text-sm text-green-700">{table.name}</div><div className="uppercase text-xs">{Helpers.getTableType(APP_STATE, table.tableTypeId).name}</div>
                      </button>
                    )
                }
              </div>
              {ASSIGNED_TABLE && (<>
                <div className="my-5 text-gray-500 text-base">
                  OR
                </div>
                <button disabled={SAVING} className={`!text-gray-500 !text-sm ${actionButtonStyles}`} onClick={returnToGuestList}>
                  Back to Guest List
                </button>
              </>)}
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}
