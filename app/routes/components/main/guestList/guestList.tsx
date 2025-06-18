import mainStyles from '../mainStyles.module.css'
import styles from "./guestListStyles.module.css";
import { useAtom } from "jotai";
import { appStateAtom, ListFilterTypeEnum, mainTakoverAtom, selectedListFilterAtom } from "~/appStateGlobal/atoms";
import { FeatureFlags, type Guest } from "~/config/AppState";
import GuestListItem from "../guestListItem/guestListItem";
import { Helpers } from '~/util/Helpers';

const baseButtonStyles = `inline-flex items-center justify-center text-white py-1 px-5 mt-1 mb-2 ring-1 rounded-full hover:cursor-pointer`;
const addGuestStyles = `${baseButtonStyles} text-sm ring-gray-500 text-gray-500 hover:ring-1 hover:ring-white`;
const addGuestEmptyListStyles = `${baseButtonStyles} text-lg ring-rose-500 rounded-full hover:ring-3 !h-[100px] !w-[100px] !py-0 !px-0`;
const viewReservationsStyles = `${baseButtonStyles} text-sm ring-gray-500 text-yellow-500 hover:ring-1 hover:ring-white`;
const reservationsDisabledStyles = `${baseButtonStyles} text-sm !ring-gray-800 !text-gray-700 hover:!cursor-default`;

export default function GuestList() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);
  const [SELECTED_LIST_FILTER] = useAtom(selectedListFilterAtom);

  const onClickAddGuestForm = (event: React.MouseEvent<HTMLButtonElement>) => setMainTakeover({addGuest: true});

  return (
    <div className={`${styles.guestListContainer} flex-1 select-none border border-gray-900 rounded-xl px-2 max-w-[580px]`}>
      <div className="flex mt-3 m-1">
        <div className="flex-1">
          {!MAIN_TAKEOVER && (
            <div className="flex justify-center gap-2">
              <button
                type="button"
                className={`${Helpers.hasGuests(APP_STATE) ? addGuestStyles : addGuestEmptyListStyles}`}
                onClick={onClickAddGuestForm}
              >
                <div>
                  {Helpers.hasGuests(APP_STATE) ? (<>
                    <div className="text-xs">Add Guest</div>
                  </>) : (<>
                    <div>ADD</div>
                    <div>GUEST</div>
                  </>)}
                </div>
              </button>
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
  )
}
