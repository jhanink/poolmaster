import { useAtom } from "jotai";
import {
  type ListFilterType,
  ListFilterTypeEnum,
  appStateAtom,
  guestExpandAllAtom,
  isQuietModeAtom,
  mainTakoverAtom,
  selectedListFilterAtom,
  selectedTableAtom,
  tableExpandAllAtom,
} from "~/appStateGlobal/atoms";
import { Helpers } from "~/util/Helpers";
import { useDrop } from "react-dnd";
import { GuestItemTypeKey, type Guest } from "~/config/AppState";
import BrandingBar from "../brandingBar/brandingBar";
import { actionIconStyles, separatorBarStyles } from "~/util/GlobalStylesUtil";
import { ArrowsPointingInIcon, ArrowsPointingOutIcon, EllipsisVerticalIcon, PlusIcon, ViewfinderCircleIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "react-router";
import { useEffect } from "react";

const statusPillStyles = `mx-1 px-1 text-nowrap`;
const selectedFilterStyle = `ring-2 ring-white border-transparent`;
const filterStyle = `inline-block py-1 px-2 mx-2 border border-gray-800 rounded-full hover:cursor-pointer`;
const dndTargetBaseStyle = `border-2 border-transparent flex justify-center text-gray-500 pt-2 pb-1 text-sm select-none rounded-full mb-1`;
const dndActiveStyle = `border-2 !border-dashed !border-red-500 `;
const dndOverStyle = `border-2 !border-white`;
const headerStyles = `flex items-center justify-center select-none text-nowrap text-base text-slate-400 rounded-full bg-gray-900 mt-2 py-1 mb-1`;
const adminCogStyles = `size-[20px] relative top-[1px] hover:text-white text-gray-500`;
const headerActionIconStyles = `size-[20px] relative top-[1px] hover:text-white text-gray-500`;
const listFilterIcons = `block md:hidden text-gray-400 hover:cursor-pointer hover:text-white`;

export default function AppHeader() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [SELECTED_LIST_FILTER, setSelectedListFilter] = useAtom(selectedListFilterAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);
  const [, setSelectedTable] = useAtom(selectedTableAtom);
  const [QUIET_MODE, setQuietMode] = useAtom(isQuietModeAtom);
  const [SEARCH_PARAMS, setSearchParams] = useSearchParams();
  const [TABLE_EXPAND_ALL, setTableExpandAll] = useAtom(tableExpandAllAtom);
  const [GUEST_EXPAND_ALL, setGuestExpandAll] = useAtom(guestExpandAllAtom);

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
      SEARCH_PARAMS.delete('lf');
      setSearchParams(SEARCH_PARAMS);
    } else {
      SEARCH_PARAMS.set('lf', type);
      setSearchParams(SEARCH_PARAMS);
      setSelectedListFilter(type);
    }
    setSelectedTable(undefined);
  }

  const onClickSettings = () => {
    if (!!MAIN_TAKEOVER) return;
    if (!!QUIET_MODE) return;
    setSelectedTable(undefined);
    setMainTakeover({adminScreen: true});
  }

  const onClickQuietMode = () => {
    if (!!MAIN_TAKEOVER) return;
    setSelectedTable(undefined)
    const QM = QUIET_MODE;
    setQuietMode(!QM);
    QM && SEARCH_PARAMS.delete('qm');
    !QM && SEARCH_PARAMS.set('qm', '1');
    setSelectedListFilter('');
    SEARCH_PARAMS.delete('lf');
    setSearchParams(SEARCH_PARAMS);
    QM && setMainTakeover({homeRedirect: true});
  }

  const onClickExpandAll = () => {
    setTableExpandAll(!TABLE_EXPAND_ALL);
    setGuestExpandAll(!GUEST_EXPAND_ALL);
  }

  const fragmentVenueHeader = () => {
    return (<>
      <div className="flex items-center justify-center w-full select-none">
        <div
          className={`${actionIconStyles} ml-3 mr-1`}
          onClick={onClickQuietMode}
        >
          <ViewfinderCircleIcon className={`${headerActionIconStyles} ${QUIET_MODE && 'text-white'}`} title="Quiet Mode"/>
        </div>
        <div className={`${headerStyles} ml-1 px-2 grow`}>
          <div className="grow text-center">
            {APP_STATE.account?.venue}
          </div>
        </div>

        <div
          className={`${actionIconStyles} ml-1 mr-2 mt-1`}
          onClick={onClickSettings}
        >
          <EllipsisVerticalIcon className={`${adminCogStyles} ${MAIN_TAKEOVER?.adminScreen && 'text-white'}`} title="Admin"/>
        </div>
      </div>
    </>)
  }

  const fragmentListFilters = () => {
    return (<>
      <div className={`flex justify-center`}>
        {!QUIET_MODE && (SELECTED_LIST_FILTER !== ListFilterTypeEnum.TABLELIST) && (
          <div className={`${listFilterIcons} size-6 mt-[2px] mr-2`}
            onClick={(event) => setMainTakeover({addGuest: true})}>
            <PlusIcon></PlusIcon>
          </div>
        )}
        {(SELECTED_LIST_FILTER !== 'tablelist') && (
          <div className="flex flex-col items-center justify-center md:text-base">
            <div className="flex items-center">
              <div className={`${SELECTED_LIST_FILTER === ListFilterTypeEnum.WAITLIST && selectedFilterStyle} ${filterStyle} !mx-1 text-blue-600`} onClick={(event) => onClickListFilter('waitlist')}>
                <span className={`${statusPillStyles} decoration-none border-0`}>
                  {APP_STATE.guestList.length} <span className="ml-1 capitalize">Waiting</span>
                </span>
              </div>
            </div>
            <div className="mt-2 text-gray-500 text-xs">Ave - <span className="text-gray-300 text-xs">{Helpers.averageWaitTime(APP_STATE)}</span></div>
          </div>
        )}
        {(SELECTED_LIST_FILTER !== ListFilterTypeEnum.WAITLIST) && (
          <div className="flex flex-col items-center justify-center md:text-base">
            <div className={`${SELECTED_LIST_FILTER === 'tablelist' && selectedFilterStyle} ${filterStyle} !mx-1 text-green-500`} onClick={(event) => onClickListFilter('tablelist')}>
              <span className={`${statusPillStyles}`}>
                {Helpers.tablesAssigned(APP_STATE).length} <span className="ml-1 capitalize">Active - {Helpers.percentTablesAssigned(APP_STATE)}%</span>
              </span>
            </div>
            <div className="mt-2 text-gray-500 text-xs"> &nbsp; Open - <span className="text-gray-300 text-xs">{Helpers.tablesAvailable(APP_STATE).length}</span></div>
          </div>
        )}
        {!QUIET_MODE && (
          <div className={`${listFilterIcons} size-5 mt-[5px] ml-2 ${TABLE_EXPAND_ALL && 'text-sky-500'}`} onClick={() => {onClickExpandAll()}}>
            {TABLE_EXPAND_ALL ? (
              <ArrowsPointingInIcon></ArrowsPointingInIcon>
            ): (
              <ArrowsPointingOutIcon></ArrowsPointingOutIcon>
            )}
          </div>
        )}
      </div>
    </>)
  }

  useEffect(() => {
    const qm = SEARCH_PARAMS.get('qm');
    setQuietMode(qm === '1');
    const lf = SEARCH_PARAMS.get('lf');
    lf && setSelectedListFilter(lf as ListFilterType);
  }, [SEARCH_PARAMS]);


  return (<>
    {fragmentVenueHeader()}
    <BrandingBar />
    {QUIET_MODE && (<>
      <div className="flex items-center justify-center grow pb-20 text-sm select-none">
        {fragmentListFilters()}
      </div>
    </>)}
    {!MAIN_TAKEOVER && <>
      {!QUIET_MODE && (<>
        <div ref={drop as unknown as React.Ref<HTMLDivElement>}
          className={`${dndTargetBaseStyle} ${canDrop && (isOver ? dndOverStyle : dndActiveStyle)} max-w-[1220px] mx-auto text-lg`}>
            {fragmentListFilters()}
        </div>
        <hr className={`${separatorBarStyles} mx-1`}/>
      </>)}
    </>}
  </>);
}
