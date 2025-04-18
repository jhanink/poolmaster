import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { appStateAtom, mainTakoverAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { type TableItemData } from "~/config/AppState";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles } from "~/util/GlobalStylesUtil";
import { Helpers } from "~/util/Helpers";
import { fragmentExitTakeover } from "../../fragments/fragments";

const unassignedStyle = `inline-block m-1 mb-2 rounded-full py-1 px-4 text-xs border border-gray-700 text-gray-600 font-bold hover:cursor-pointer`;

export function DndGuestAssignTable() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [, setSelectedTable] = useAtom(selectedTableAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);

  const TopRef = useRef<HTMLDivElement>(null);
  const tables = APP_STATE.tables;

  const onClickTableChip = async (event: React.MouseEvent<HTMLDivElement>, table: TableItemData) => {
    const tableId = table.id
    const guestId = MAIN_TAKEOVER.dndGuest?.id || 0;
    const newState = await AppStorage.assignToTableRemote({tableId, guestId});
    setAppState(newState);
    reset();
  }

  const onClickCancelAssign = () => {
    setMainTakeover(undefined);
    setSelectedTable(undefined);
  };

  const reset = () => {
    setSelectedTable(undefined);
    setMainTakeover(undefined);
  }

  useEffect(() => {
    TopRef.current && TopRef.current.scrollIntoView();
  },)

  return (
    <div className="select-none flex-1 text-center relative items-center" ref={TopRef}>
      {fragmentExitTakeover(onClickCancelAssign)}
      <div className="inline-block">
        <div className="CONTENT px-20">
          {!Helpers.tablesAvailable(APP_STATE).length && <>
            <div className="text-gray-500 text-sm mt-3 p-3 uppercase">
              No open tables available
            </div>
            <button className={`${actionButtonStyles}`} onClick={onClickCancelAssign}>Exit</button>
          </>}
          {!!Helpers.tablesAvailable(APP_STATE).length && <>
            <div className="text-xl text-gray-400 mt-5">
              <div>
                {!!MAIN_TAKEOVER?.dndGuest?.assignedAt && (
                  <span>MOVE</span>
                )}
                {!MAIN_TAKEOVER?.dndGuest?.assignedAt && (
                  <span>ASSIGN</span>
                )}
              </div>
              <div className="uppercase text-red-500 mx-3 my-2 whitespace-nowrap">
                <span className="text-gray-700 mr-3">Guest</span>
                {MAIN_TAKEOVER.dndGuest?.name}
              </div>
              <div>
                to one of the following open tables
              </div>
            </div>
            <div className="mt-10 inline-block max-w-lg mx-auto">
              {
                tables
                  .filter((table: TableItemData) => !table.guest)
                  .sort((A: TableItemData, B: TableItemData) =>
                    A.number - B.number
                  )
                  .map((table: TableItemData, index: number) =>
                    <div className={`CHIP ${unassignedStyle}`}
                      key={table.id}
                      data-table-id={table.id}
                      onClick={(event) => onClickTableChip(event, table)}
                    >
                      {table.nickname || table.name}
                    </div>
                  )
              }
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}
