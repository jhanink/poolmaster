import mainStyles from '../mainStyles.module.css'
import { actionButtonStyles } from "~/util/GlobalStylesUtil";
import styles from "./guestListStyles.module.css";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { appStateAtom, guestFormOpenAtom } from "~/appStateGlobal/atoms";
import { DefaultGuestData, type Guest } from "~/config/AppState";
import GuestForm from "../guestForm/guestForm";
import GuestListItem from "../guestListItem/guestListItem";

const guestButtonStyles = `text-gray-500 border-gray-800 ${actionButtonStyles} hover:ring-1`;

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
            <div className="flex-1 mx-2 mt-3 mb-5 text-center nowrap">
              <button type="button" className={`flex items-center ${guestButtonStyles}`} onClick={onClickAddToGuestList}>
                <ArrowRightIcon aria-hidden="true" className="mr-2 size-3" />
                <span className="text-sm">Add Guest</span>
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
