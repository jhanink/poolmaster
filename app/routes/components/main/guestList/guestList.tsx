import mainStyles from '../mainStyles.module.css'
import styles from "./guestListStyles.module.css";
import { useAtom } from "jotai";
import { appStateAtom, guestExpandAllAtom, ListFilterTypeEnum, mainTakoverAtom, selectedListFilterAtom } from "~/appStateGlobal/atoms";
import { FeatureFlags, type Guest } from "~/config/AppState";
import GuestListItem from "../guestListItem/guestListItem";
import { Helpers } from '~/util/Helpers';
import { ArrowsPointingInIcon, ArrowsPointingOutIcon, PlusIcon } from '@heroicons/react/24/outline';

const baseButtonStyles = `inline-flex items-center justify-center text-white py-1 px-5 mt-1 mb-2 ring-1 rounded-full hover:cursor-pointer`;
const viewReservationsStyles = `${baseButtonStyles} text-sm ring-gray-500 text-yellow-500 hover:ring-1 hover:ring-white`;
const reservationsDisabledStyles = `${baseButtonStyles} text-sm !ring-gray-800 !text-gray-700 hover:!cursor-default`;

const columnBorders = `${FeatureFlags.SHOW_MAIN_SWIMLANES && 'md:border border-gray-900 rounded-xl md:ml-3 sm:mx-auto md:mx-0'}`;

export default function GuestList() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);
  const [SELECTED_LIST_FILTER] = useAtom(selectedListFilterAtom);
  const [GUEST_EXPAND_ALL, setGuestExpandAll] = useAtom(guestExpandAllAtom);

  const onClickAddGuestForm = (event: React.MouseEvent<HTMLButtonElement>) => setMainTakeover({addGuest: true});

  const onClickExpandAll = () => {
    setGuestExpandAll(!GUEST_EXPAND_ALL);
    console.log(GUEST_EXPAND_ALL)
  }

  const fragmentSwimlaneHeader = () => {
    return FeatureFlags.SHOW_MAIN_SWIMLANES && (<>
      <div className="sticky bg-gray-800/40 relative top-[-1px] z-9 bg-black md:flex hidden border-b border-gray-950 p-2 text-xl items-center text-gray-200 rounded-t-xl">
        <div className="flex items-center w-full gap-3">
          <div className="grow">
            <span className="ml-15">Guest List</span>
          </div>
          {GUEST_EXPAND_ALL ? (
            <div className="text-gray-500 size-5 hover:cursor-pointer text-sky-500" onClick={() => {onClickExpandAll()}}>
            <ArrowsPointingInIcon></ArrowsPointingInIcon>
          </div>
          ) : (
            <div className="text-gray-500 size-5 hover:cursor-pointer hover:text-white" onClick={() => {onClickExpandAll()}}>
            <ArrowsPointingOutIcon></ArrowsPointingOutIcon>
          </div>
          )}
          <div className="text-gray-500 size-6 hover:cursor-pointer hover:text-white" onClick={() => {setMainTakeover({addGuest: true})}}>
            <PlusIcon></PlusIcon>
          </div>
        </div>
      </div>
    </>)
  }

  return (
    <div className={`${styles.guestListContainer} snap-start flex-1 text-center select-none ${columnBorders} max-w-[600px]`}>
      {fragmentSwimlaneHeader()}
      <div className="px-2">
        <div className="flex mt-3 m-1">
          <div className="flex-1">
            {!MAIN_TAKEOVER && (
              <div className="flex justify-center gap-2">
                {FeatureFlags.SHOW_RESERVATIONS && (
                  <button
                    type="button"
                    disabled={!APP_STATE.reservations.length}
                    className={`${APP_STATE.reservations.length ? viewReservationsStyles : reservationsDisabledStyles}`}
                    onClick={onClickAddGuestForm}
                  >
                    <div className="text-xs">See Reservations: {APP_STATE.reservations.length}</div>
                  </button>
                )}

              </div>
            )}
          </div>
        </div>
        {!!APP_STATE.guestList.length && (<>
          <div className={`${mainStyles.column} justify-center mb-10`}>
            {APP_STATE.guestList
              .sort((A: Guest, B: Guest) =>
                A.createdAt - B.createdAt
              )
              .map((guest: Guest, index: number) =>
                <GuestListItem guest={guest} key={guest.id} index={index}></GuestListItem>
              )
            }
          </div>
          {(!Helpers.tablesAssigned(APP_STATE).length || SELECTED_LIST_FILTER === ListFilterTypeEnum.WAITLIST) && (<>
            <div className={`${styles.bottomScrollSpacer}`}>&nbsp;</div>
          </>)}
        </>)}
      </div>
    </div>
  )
}
