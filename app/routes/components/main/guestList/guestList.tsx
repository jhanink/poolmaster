import mainStyles from '../mainStyles.module.css'
import styles from "./guestListStyles.module.css";
import { useAtom } from "jotai";
import { appStateAtom, mainTakoverAtom } from "~/appStateGlobal/atoms";
import { type Guest } from "~/config/AppState";
import GuestListItem from "../guestListItem/guestListItem";
import { Helpers } from '~/util/Helpers';

const addGuestBaseStyles = `inline-flex items-center justify-center text-white py-1 px-5 mt-1 mb-2 ring-1 rounded-full hover:cursor-pointer`;
const addGuestStyles = `${addGuestBaseStyles} text-sm ring-gray-500 text-gray-500 hover:ring-1 hover:ring-white`;
const addGuestEmptyListStyles = `${addGuestBaseStyles} text-lg ring-rose-500 rounded-full hover:ring-3 !h-[100px] !w-[100px] !py-0 !px-0`;

export default function GuestList() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);

  const onClickAddGuestForm = (event: React.MouseEvent<HTMLButtonElement>) => setMainTakeover({addGuest: true});

  return (
    <div className={`${styles.guestListContainer} text-center mx-auto flex-1 max-w-xl select-none`}>
      <div className="flex mt-3 m-1">
        <div className="flex-1">
          {!MAIN_TAKEOVER?.addGuest && (
            <div className="">
              <button
                type="button"
                className={`${Helpers.hasGuests(APP_STATE) ? addGuestStyles : addGuestEmptyListStyles}`}
                onClick={onClickAddGuestForm}
              >
                <div>
                  {Helpers.hasGuests(APP_STATE) && (<>
                    <div className="text-xs">Add Guest</div>
                  </>)}
                  {!Helpers.hasGuests(APP_STATE) && (<>
                    <div>ADD</div>
                    <div>GUEST</div>
                  </>)}
                </div>
              </button>
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
        <div className={`${styles.bottomScrollSpacer}`}>&nbsp;</div>
      </>)}
    </div>
  )
}
