import { useAtom } from "jotai";
import { appStateAtom, mainTakoverAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { type TableItemData } from "~/config/AppState";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles } from "~/util/GlobalStylesUtil";
import { Helpers } from "~/util/Helpers";

const unassignedStyle = `inline-block m-1 mb-2 rounded-full py-1 px-4 text-xs border border-gray-700 text-gray-600 font-bold hover:cursor-pointer`;

export function DndGuestAssignTable() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [, setSelectedTable] = useAtom(selectedTableAtom);

  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);

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

  const onClickDeleteGuest = async () => {
    const guestId = MAIN_TAKEOVER.dndGuest?.id || 0;
    const newState = await AppStorage.deleteGuestRemote(guestId);
    setAppState(newState);
    reset();
  }

  const reset = () => {
    setSelectedTable(undefined);
    setMainTakeover(undefined);
  }

  return (
    <div className="border-white select-none">
      <div className="flex-1 text-center">
        {!Helpers.tablesAvailable(APP_STATE).length && <>
          <div className="text-gray-500 text-sm mt-3 p-3 uppercase">
            No open tables available
          </div>
          <button className={`${actionButtonStyles}`} onClick={onClickCancelAssign}>Exit</button>
        </>}
        {!!Helpers.tablesAvailable(APP_STATE).length && <>
          <div className="text-xl text-gray-400 mt-10">
            Assign
            <span className="uppercase text-red-500 mx-3">{MAIN_TAKEOVER.dndGuest?.name}</span>
            to an open table
          </div>
          <div>
            <div className="my-3 top-0 z-10">
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
          </div>
          <div className="my-3">
            <button className={`${actionButtonStyles} mx-2`} onClick={onClickCancelAssign}>Cancel</button>
            <button className={`${actionButtonStyles} mx-2`} onClick={onClickDeleteGuest}>Trash</button>
          </div>
        </>}
      </div>
    </div>
  );
}