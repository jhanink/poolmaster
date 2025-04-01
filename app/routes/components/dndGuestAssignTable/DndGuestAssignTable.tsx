import { useAtom } from "jotai";
import { appStateAtom, dndGuestToAssignTableAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { type TableItemData } from "~/config/AppState";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles } from "~/util/GlobalStylesUtil";

const unassignedStyle = `inline-block m-1 mb-2 rounded-full py-1 px-4 text-xs border border-gray-700 text-gray-600 font-bold hover:cursor-pointer`;

export function DndGuestAssignTable() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [SELECTED_TABLE, setSelectedTable] = useAtom(selectedTableAtom);
  const [DND_GUEST, setDndGuestToAssignTable] = useAtom(dndGuestToAssignTableAtom);

  const tables = APP_STATE.tables;

  const cancelAssignClicked = () => {
    setDndGuestToAssignTable(undefined);
  };

  const reset = () => {
    setSelectedTable(undefined);
    setDndGuestToAssignTable(undefined);
  }

  const deleteGuestClicked = async () => {
    const guestId = DND_GUEST?.id || 0;
    const newState = await AppStorage.deleteGuestRemote(guestId);
    setAppState(newState);
    reset();
  }

  const onClickTableChip = async (event: React.MouseEvent<HTMLDivElement>, table: TableItemData) => {
    const tableId = table.id
    const guestId = DND_GUEST?.id || 0;
    const newState = await AppStorage.assignToTableRemote({tableId, guestId});
    setAppState(newState);
    reset();
  }

  return (
    <div className="border-white select-none">
      <div className="flex-1 text-center">
        {tables.filter((table: TableItemData) => !table.guest).length === 0 && (
          <div className="text-gray-200 text-sm mt-3 p-3">
            No open tables available <button className={`${actionButtonStyles}`} onClick={cancelAssignClicked}>Exit</button>
          </div>
        )}
        {tables.filter((table: TableItemData) => !table.guest).length && <>
          <div className="text-xl text-gray-400 mt-10">
            Assign <span className="uppercase text-red-500">{DND_GUEST?.name}</span> to an open table
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
            <button className={`${actionButtonStyles} mx-2`} onClick={cancelAssignClicked}>Cancel</button>
            <button className={`${actionButtonStyles} mx-2`} onClick={deleteGuestClicked}>Trash</button>
          </div>
        </>}
      </div>
    </div>
  );
}