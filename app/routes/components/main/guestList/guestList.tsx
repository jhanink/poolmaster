import mainStyles from '../mainStyles.module.css'
import styles from "./guestListStyles.module.css";
import { useAtom } from "jotai";
import { appStateAtom, mainTakoverAtom } from "~/appStateGlobal/atoms";
import { type Guest } from "~/config/AppState";
import GuestListItem from "../guestListItem/guestListItem";

const addGuestStyles = `flex items-center text-center h-[30px] w-[125px] mt-5 mb-2 !text-sm !text-blue-500 !text-white inline-flex justify-center items-center hover:cursor-pointer ring-1 ring-gray-500 rounded-full font-semibold hover:ring-blue-500 hover:ring-2`;
const addGuestEmptyListStyles = `${addGuestStyles} !h-[100px] !w-[100px] !px-0 !text-white`;

export default function GuestList() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);

  const onClickAddGuestForm = (event: React.MouseEvent<HTMLButtonElement>) => setMainTakeover({addGuest: true});

  return (
    <div className={`${styles.guestListContainer} text-center mx-auto flex-1 max-w-xl select-none mb-10`}>
      <div className="flex m-1">
        <div className="flex-1">
          { !MAIN_TAKEOVER?.addGuest && (
            <div className="">
              <button
                type="button"
                className={`${APP_STATE.guestList.length ? addGuestStyles : addGuestEmptyListStyles}`}
                onClick={onClickAddGuestForm}
              >
                <div>
                  {!!APP_STATE.guestList.length && (<>
                    <div>Add Guest</div>
                  </>)}
                  {!APP_STATE.guestList.length && (<>
                    <div>Add</div>
                    <div>Guest</div>
                  </>)}
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={`${mainStyles.column} justify-center`}>
        {
          APP_STATE.guestList
            .sort((A: Guest, B: Guest) =>
              A.createdAt - B.createdAt
            )
            .map((guest: Guest, index: number) =>
              <GuestListItem guest={guest} key={guest.id} index={index}></GuestListItem>
            )
        }
      </div>
      <div className={`${styles.bottomScrollSpacer}`}>&nbsp;</div>
    </div>
  )
}
