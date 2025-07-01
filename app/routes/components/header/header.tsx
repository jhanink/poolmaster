import { useAtom } from "jotai";
import {
  type ListFilterType,
  appStateAtom,
  isQuietModeAtom,
  mainTakoverAtom, selectedListFilterAtom,
  selectedTableAtom
} from "~/appStateGlobal/atoms";
import { Helpers } from "~/util/Helpers";
import { useDrop } from "react-dnd";
import { GuestItemTypeKey, type Guest } from "~/config/AppState";
import BrandingBar from "../brandingBar/brandingBar";
import { actionIconStyles, separatorBarStyles } from "~/util/GlobalStylesUtil";
import { EllipsisVerticalIcon, PlusIcon, ViewfinderCircleIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "react-router";
import { useEffect } from "react";

const statusPillStyles = `mx-1 px-1 text-nowrap`;
const selectedFilterStyle = `ring-2 ring-white border-transparent`;
const filterStyle = `inline-block py-1 px-2 mx-2 border border-gray-800 rounded-full hover:cursor-pointer`;
const dndTargetBaseStyle = `border-2 border-transparent flex justify-center text-gray-500 pt-2 pb-1 text-sm select-none rounded-full mb-1`;
const dndActiveStyle = `border-2 !border-dashed !border-red-500 `;
const dndOverStyle = `border-2 !border-white`;
const headerStyles = `flex items-center justify-center select-none text-nowrap text-lg text-slate-400 rounded-full bg-gray-900 mt-2 py-1 mb-1`;
const adminCogStyles = `size-[20px] relative top-[1px] hover:text-white text-gray-500`;
const quietModeStyles = `size-[20px] relative top-[1px] hover:text-white text-gray-500`;

export default function AppHeader() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [SELECTED_LIST_FILTER, setSelectedListFilter] = useAtom(selectedListFilterAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);
  const [, setSelectedTable] = useAtom(selectedTableAtom);
  const [QUIET_MODE, setQuietMode] = useAtom(isQuietModeAtom);
  const [SEARCH_PARAMS, setSearchParams] = useSearchParams();

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: GuestItemTypeKey, // MUST match the KEY from useDrag
    drop: (item: {guest: Guest}, monitor) => {
        if(monitor.canDrop()) {
          setMainTakeover({assignTableGuest: item.guest});
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

  const onClickSettings = () => {
    if (!!MAIN_TAKEOVER) return;
    setSelectedTable(undefined);
    setMainTakeover({adminScreen: true});
  }

  const onClickQuietMode = () => {
    setQuietMode(!QUIET_MODE);
    SEARCH_PARAMS.delete('qm');
    !QUIET_MODE ? setSearchParams({qm: '1'}, {replace: true}) : setSearchParams(SEARCH_PARAMS, {replace: true});
  }

  useEffect(() => {
    const qm = SEARCH_PARAMS.get('qm');
    setQuietMode(qm === '1');
  }, [SEARCH_PARAMS]);


  return (<>
      <div className="flex items-center justify-center">
        <div className={`${headerStyles} ml-1 px-2 grow`}>
          <div
            className={`${actionIconStyles} mr-1`}
            onClick={onClickQuietMode}>
            <ViewfinderCircleIcon className={`${quietModeStyles} ${QUIET_MODE && 'text-white'}`}/>
          </div>
          <div className="grow text-center">
          {APP_STATE.account?.venue}
          </div>
        </div>
        <div
          className={`${actionIconStyles} mr-1`}
          onClick={onClickSettings}>
          <EllipsisVerticalIcon className={`${adminCogStyles} ${MAIN_TAKEOVER?.adminScreen && 'text-white'}`}/>
        </div>
      </div>
      <BrandingBar />
      {!MAIN_TAKEOVER && <>
        <div ref={drop as unknown as React.Ref<HTMLDivElement>}
          className={`${QUIET_MODE && 'mt-50'} ${dndTargetBaseStyle} ${canDrop && (isOver ? dndOverStyle : dndActiveStyle)} max-w-[1220px] mx-auto text-lg`}>
            {(SELECTED_LIST_FILTER !== 'tablelist') && (
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center">
                  {!QUIET_MODE && (
                    <div className="block md:hidden size-6 text-gray-400 mr-2 hover:cursor-pointer hover:text-white"
                      onClick={(event) => setMainTakeover({addGuest: true})}>
                      <PlusIcon></PlusIcon>
                    </div>
                  )}
                  <div className={`${SELECTED_LIST_FILTER === 'waitlist' && selectedFilterStyle} ${filterStyle} !mx-1 text-blue-600`} onClick={(event) => onClickListFilter('waitlist')}>
                    <span className={`${statusPillStyles} text-nowrap`}>
                      {APP_STATE.guestList.length} <span className="ml-1 capitalize">Guests</span>
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-gray-500">Est Wait: {Helpers.averageWaitTime(APP_STATE)}</div>
              </div>
            )}
            {(SELECTED_LIST_FILTER !== 'waitlist') && (
              <div className="flex flex-col items-center justify-center">
                <div className={`${SELECTED_LIST_FILTER === 'tablelist' && selectedFilterStyle} ${filterStyle} !mx-1 text-green-500`} onClick={(event) => onClickListFilter('tablelist')}>
                  <span className={`${statusPillStyles}`}>
                    {Helpers.tablesAssigned(APP_STATE).length} <span className="ml-1 capitalize">Active - {Helpers.percentTablesAssigned(APP_STATE)}%</span>
                  </span>
                </div>
                <div className="mt-2 text-gray-500"> &nbsp; Open Tables: {Helpers.tablesAvailable(APP_STATE).length}</div>
              </div>
            )}
        </div>
        {!QUIET_MODE && (
          <hr className={`${separatorBarStyles}`}/>
        )}
      </>}
  </>);
}
