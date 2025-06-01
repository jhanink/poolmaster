import mainStyles from '../mainStyles.module.css'
import { actionButtonStyles } from "~/util/GlobalStylesUtil";
import styles from "./guestListStyles.module.css";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { appStateAtom, mainTakoverAtom } from "~/appStateGlobal/atoms";
import { type Guest } from "~/config/AppState";
import GuestListItem from "../guestListItem/guestListItem";

const addGuestStyles = `flex items-center text-center text-gray-500 border-gray-800 ${actionButtonStyles} hover:ring-1`;
const addGuestEmptyListStyles = `text-center h-[150px] w-[150px] rounded-full !mr-0 ${addGuestStyles}`;

export default function GuestList() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);

  const onClickAddGuestForm = (event: React.MouseEvent<HTMLButtonElement>) => setMainTakeover({addGuest: true});

  return (
    <div className={`${styles.guestListContainer} text-center mx-auto flex-1 max-w-xl select-none mb-10`}>
      <div className="flex m-1">
        <div className="flex-1">
          { !MAIN_TAKEOVER?.addGuest && (
            <div className="flex-1 mx-2 mt-3 mb-5 text-center text-nowrap">
              <button
                type="button"
                className={`${APP_STATE.guestList.length ? addGuestStyles : addGuestEmptyListStyles}`}
                onClick={onClickAddGuestForm}
              >
                <ArrowRightIcon aria-hidden="true" className="mr-2 size-4" />
                <span className="text-sm">Add Guest</span>
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
