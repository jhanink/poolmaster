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

const statusPillStyles = `mr-2 px-1 whitespace-nowrap`;
const selectedFilterStyle = `ring-2 ring-white border-transparent`;

const dndTargetBaseStyle = `flex justify-center text-gray-500 py-2 pb-2 text-sm select-none`;
export const dndVerticalActiveStyle = `phone:bg-green-300 phone:invert`;
export const dndVerticalOverStyle = `phone:blur-[2px] phone:bg-white`;
export const dndActiveStyle = `bg-green-300 invert`;
export const dndOverStyle = `blur-[2px] bg-white`;

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
    <>
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
          <span className={`${SELECTED_LIST_FILTER === 'waitlist' ? selectedFilterStyle : ''} py-1 px-2 mx-3 border border-gray-500 text-blue-500 rounded-full hover:cursor-pointer`} onClick={(event) => onClickListFilter('waitlist')}>
            <span className={`${statusPillStyles}`}>{APP_STATE.guestList.length} &nbsp; Waiting</span>
          </span>
          <span className={`${SELECTED_LIST_FILTER === 'tablelist' ? selectedFilterStyle : ''} py-1 px-2 mx-3 border border-gray-500 text-green-600 rounded-full hover:cursor-pointer`} onClick={(event) => onClickListFilter('tablelist')}>
            <span className={`${statusPillStyles}`}>
              {Helpers.tablesAssigned(APP_STATE).length} &nbsp; Assigned
              <span className="text-gray-500"> &nbsp; ({Helpers.tablesAvailable(APP_STATE).length} open)</span>
            </span>
          </span>
        </div>
      </>}
    </>
  );
}
