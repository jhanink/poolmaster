import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { appStateAtom, mainTakoverAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { type TableItem } from "~/config/AppState";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles } from "~/util/GlobalStylesUtil";
import { Helpers } from "~/util/Helpers";
import { fragmentExitTakeover } from "../../fragments/fragments";

const unassignedStyle = `inline-block m-1 mb-2 rounded-full py-1 px-4 text-xs border border-gray-700 text-gray-600 font-bold hover:cursor-pointer`;

export default function AssignTable() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [, setSelectedTable] = useAtom(selectedTableAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);

  const TopRef = useRef<HTMLDivElement>(null);
  const tables = APP_STATE.tables.filter((table: TableItem) => {
    return table.isActive;
  });

  const onClickTableChip = async (event: React.MouseEvent<HTMLDivElement>, table: TableItem) => {
    event.stopPropagation();
    event.preventDefault();
    const tableId = table.id
    const guestId = MAIN_TAKEOVER.assignTable?.id || 0;
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
      <div>
        <div className="CONTENT mx-5">
          {!Helpers.tablesAvailable(APP_STATE).length && <>
            <div className="text-gray-500 text-sm mt-3 p-3 uppercase">
              No open tables available
            </div>
            <button className={`${actionButtonStyles}`} onClick={onClickCancelAssign}>Exit</button>
          </>}
          {!!Helpers.tablesAvailable(APP_STATE).length && <>
            <div className="text-2xl mt-5">
              <div className="text-gray-300 uppercase">
                {!!MAIN_TAKEOVER?.assignTable?.assignedAt && (
                  <span>Move</span>
                )}
                {!MAIN_TAKEOVER?.assignTable?.assignedAt && (
                  <span>Assign</span>
                )}
                <span className="ml-2">Guest</span>
              </div>
              <div className="uppercase text-red-500 mx-3 my-5 text-nowrap">
                {MAIN_TAKEOVER.assignTable?.name}
              </div>
              <div className="text-gray-400 text-base">
                to one of the following open tables
              </div>
            </div>
            <div className="mt-5 inline-block max-w-lg mx-auto">
              {
                tables
                  .filter((table: TableItem) => !table.guest)
                  .sort((A: TableItem, B: TableItem) =>
                    A.number - B.number
                  )
                  .map((table: TableItem) =>
                    <div className={`CHIP ${unassignedStyle}`}
                      key={table.id}
                      data-table-id={table.id}
                      onClick={(event) => onClickTableChip(event, table)}
                    >
                      {table.name}
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
