import { useAtom } from "jotai";
import {
  type ListFilterType,
  appStateAtom,
  mainTakoverAtom, selectedListFilterAtom,
  selectedTableAtom
} from "~/appStateGlobal/atoms";
import { Helpers } from "~/util/Helpers";
import { useDrop } from "react-dnd";
import { GuestItemTypeKey, type Guest } from "~/config/AppState";

const statusPillStyles = `mx-1 px-1 text-nowrap`;
const selectedFilterStyle = `ring-2 ring-white border-transparent`;
const filterStyle = `inline-block py-1 px-2 mx-2 border border-gray-800 rounded-full hover:cursor-pointer`;
const dndTargetBaseStyle = `flex justify-center text-gray-500 py-2 pb-2 text-sm select-none`;
const dndActiveStyle = `bg-green-300 invert`;
const dndOverStyle = `blur-[2px] bg-white`;

export default function AppHeader() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [SELECTED_LIST_FILTER, setSelectedListFilter] = useAtom(selectedListFilterAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);
  const [, setSelectedTable] = useAtom(selectedTableAtom);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: GuestItemTypeKey, // MUST match the 'type' from useDrag
    drop: (item: {guest: Guest}, monitor) => {
        if(monitor.canDrop()) {
          setMainTakeover({assignTable: item.guest});
          setSelectedTable(undefined);
          setSelectedListFilter('');
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
    }
    setSelectedTable(undefined);
  }

  return (
    <div className="w-full text-center">
      <div className="flex items-center relative text-center select-none">
        <div className="flex-1 mt-3 mb-1 mx-2 py-1 text-nowrap text-lg text-slate-400 rounded-full bg-gray-900">
          {APP_STATE.account?.venue}
        </div>
      </div>
      {!MAIN_TAKEOVER && <>
        <div ref={drop as unknown as React.Ref<HTMLDivElement>}
            className={`
              text-lg
              ${dndTargetBaseStyle}
              ${canDrop &&  (isOver ? dndOverStyle : dndActiveStyle)}
            `}>
          <div>
            <div className={`${SELECTED_LIST_FILTER === 'waitlist' && selectedFilterStyle} ${filterStyle} text-blue-500`} onClick={(event) => onClickListFilter('waitlist')}>
              <span className={`${statusPillStyles} text-nowrap`}>
                {APP_STATE.guestList.length} <span className="ml-1 capitalize">{Helpers.pluralizeGuestsWaiting(APP_STATE)} In Line</span>
              </span>
            </div>
            <div className="mt-2 text-gray-500">Est Wait: {Helpers.averageWaitTime(APP_STATE)}</div>
          </div>
          <div>
            <div className={`${SELECTED_LIST_FILTER === 'tablelist' && selectedFilterStyle} ${filterStyle} text-green-500`} onClick={(event) => onClickListFilter('tablelist')}>
              <span className={`${statusPillStyles}`}>
                {Helpers.tablesAssigned(APP_STATE).length} <span className="ml-1 capitalize">{Helpers.pluralizeTablesAssigned(APP_STATE)} Used - {Helpers.percentTablesAssigned(APP_STATE)}%</span>
              </span>
            </div>
            <div className="mt-2 text-gray-500"> &nbsp; Open Tables: {Helpers.tablesAvailable(APP_STATE).length}</div>
          </div>
        </div>
      </>}
    </div>
  );
}
