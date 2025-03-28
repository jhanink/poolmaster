import mainStyles from '../mainStyles.module.css'
import { actionButtonStyles } from "~/util/GlobalStylesUtil";
import styles from "./guestListStyles.module.css";
import { ArrowRightIcon, PlusIcon } from "@heroicons/react/24/outline";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { appStateAtom, guestFormOpenAtom } from "~/appStateGlobal/atoms";
import { DefaultGuestData, type Guest } from "~/config/AppState";
import GuestForm from "../guestForm/guestForm";
import GuestListItem from "../guestListItem/guestListItem";

const guestButtonStyles = `text-gray-500 border-gray-800 font-normal ${actionButtonStyles} px-3 py-2 hover:ring-1`;

export default function GuestList() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [GUEST_FORM_OPEN, setGuestFormOpen] = useAtom(guestFormOpenAtom);

  const onClickAddToGuestList = (event: React.MouseEvent<HTMLButtonElement>) => {
    setGuestFormOpen(!GUEST_FORM_OPEN);
  }

  return (
    <div className={`${styles.guestListContainer} text-center mx-auto flex-1 max-w-xl select-none mb-10`}>
      <div className="flex m-1">
        <div className="flex-1">
          { !GUEST_FORM_OPEN && (
            <div className="flex-1 m-2 mt-3 text-center nowrap">
              <button type="button" className={`${guestButtonStyles}`} onClick={onClickAddToGuestList}>
                {/* <PlusIcon aria-hidden="true" className="mr-3 size-4" /> */}
                <ArrowRightIcon aria-hidden="true" className="mr-2 size-5" />
                <span className="text-md">Guest Check In</span>
              </button>
            </div>
          )}
          { GUEST_FORM_OPEN && (
            <div className="mx-7 mb-5">
              <GuestForm guest={DefaultGuestData}></GuestForm>
            </div>
          )}
        </div>
      </div>

      <div className="flex mt-5">
        {
          APP_STATE.guestList.length === 0 && !GUEST_FORM_OPEN && (
              <div className="flex-1 text-center mx-auto motion-preset-confetti">
                <FontAwesomeIcon className="size-5 mr-1 text-gray-400" icon={faCoffee} />
                <span className="text-xl text-gray-600 ml-3">( NO GUESTS WAITING )</span>
              </div>
          )
        }
      </div>

      <div className={`WAITLIST text-sm text-gray-500`}>
        Wait List ({APP_STATE.guestList.length})
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

      {/* <div className={`RESERVATIONS mt-10 text-sm text-gray-500`}>
        Reservations ({Helpers.reservations(APP_STATE).length})
      </div> */}

      <div className={`${styles.bottomScrollSpacer}`}>&nbsp;</div>
    </div>
  )
}
