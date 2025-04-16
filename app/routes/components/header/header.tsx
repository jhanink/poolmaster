import { useAtom } from "jotai";
import {
  type ListFilterType,
  appStateAtom,
  guestFormOpenAtom, mainTakoverAtom, selectedListFilterAtom,
  selectedTableAtom
} from "~/appStateGlobal/atoms";
import { Helpers } from "~/util/Helpers";
import { useDrop } from 'react-dnd';
import { type Guest } from "~/config/AppState";

const statusPillStyles = `mx-1 px-1 whitespace-nowrap`;
const selectedFilterStyle = `ring-2 ring-white border-transparent`;
const filterStyle = `inline-block py-1 px-2 mx-2 border border-gray-500 rounded-full hover:cursor-pointer`;
const dndTargetBaseStyle = `flex justify-center text-gray-500 py-2 pb-2 text-sm select-none`;
const dndActiveStyle = `bg-green-300 invert`;
const dndOverStyle = `blur-[2px] bg-white`;

export default function AppHeader() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [SELECTED_LIST_FILTER, setSelectedListFilter] = useAtom(selectedListFilterAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);
  const [, setSelectedTable] = useAtom(selectedTableAtom);
  const [, setGuestFormOpen] = useAtom(guestFormOpenAtom);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'GUEST_ITEM', // MUST match the 'type' from useDrag
    drop: (item: {guest: Guest}, monitor) => {
        if(monitor.canDrop()) {
          setMainTakeover({dndGuest: item.guest});
          setSelectedTable(undefined);
          setSelectedListFilter('');
          setGuestFormOpen(false);
        }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const onClickListFilter = (type: ListFilterType) => {
    if (type === SELECTED_LIST_FILTER) {
      setSelectedListFilter('');
    } else {
      setSelectedListFilter(type);
      setGuestFormOpen(false);
    }
    setSelectedTable(undefined);
  }

  return (
    <div className="w-full text-center">
      <div className="flex items-center relative text-center border-b border-t border-gray-900 p-1 select-none">
        <div className="flex-1 my-1 text-nowrap text-base text-gray-400">
          {APP_STATE.account?.venue || 'Pool Master'}
        </div>
      </div>
      {!MAIN_TAKEOVER?.adminScreen && !(MAIN_TAKEOVER?.dndGuest) && !MAIN_TAKEOVER?.closeoutTable && <>
        <div ref={drop as unknown as React.Ref<HTMLDivElement>}
            className={`
              text-lg
              ${dndTargetBaseStyle}
              ${canDrop &&  (isOver ? dndOverStyle : dndActiveStyle)}
            `}>
          <div>
            <div className={`${SELECTED_LIST_FILTER === 'waitlist' && selectedFilterStyle} ${filterStyle} text-blue-500`} onClick={(event) => onClickListFilter('waitlist')}>
              <span className={`${statusPillStyles} whitespace-nowrap capitalize`}>
                {APP_STATE.guestList.length} &nbsp; {Helpers.pluralizeGuestsWaiting(APP_STATE)} Waiting
              </span>
            </div>
            <div className="mt-2 text-gray-500">Avg Wait: {Helpers.averageWaitTime(APP_STATE)}</div>
          </div>
          <div>
            <div className={`${SELECTED_LIST_FILTER === 'tablelist' && selectedFilterStyle} ${filterStyle} text-green-500`} onClick={(event) => onClickListFilter('tablelist')}>
              <span className={`${statusPillStyles} capitalize`}>
                {Helpers.tablesAssigned(APP_STATE).length} &nbsp; {Helpers.pluralizeTablesAssigned(APP_STATE)} Assigned
              </span>
            </div>
            <div className="mt-2 text-gray-500 capitalize"> &nbsp; Open Tables: {Helpers.tablesAvailable(APP_STATE).length}</div>
          </div>
        </div>
      </>}
    </div>
  );
}
