import mainStyles from '../mainStyles.module.css'

import { useAtom } from "jotai";
import { appStateAtom, guestExpandAllAtom, mainTakoverAtom } from "~/appStateGlobal/atoms";
import { FeatureFlags, type Guest } from "~/config/AppState";
import GuestListItem from "../guestListItem/guestListItem";
import { ArrowsPointingInIcon, ArrowsPointingOutIcon, PlusIcon } from '@heroicons/react/24/outline';
import { columnItemListStyles, mainColumnContentStyles, mainColumnStyles, mainListSwimLaneHeader } from '~/util/GlobalStylesUtil';
import { Helpers } from '~/util/Helpers';

export default function GuestList() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [,setMainTakeover] = useAtom(mainTakoverAtom);
  const [GUEST_EXPAND_ALL, setGuestExpandAll] = useAtom(guestExpandAllAtom);

  const onClickExpandAll = () => {
    setGuestExpandAll(!GUEST_EXPAND_ALL);
    console.log(GUEST_EXPAND_ALL)
  }

  const fragmentSwimlaneHeader = () => {
    return FeatureFlags.SHOW_MAIN_SWIMLANES && (<>
      <div className={`${mainListSwimLaneHeader}`}>
        <div className="flex items-center w-full gap-3">
          <div className="grow">
            <span className="ml-15">Guests</span>
          </div>
          {GUEST_EXPAND_ALL ? (
            <div className="size-5 hover:cursor-pointer text-sky-500" onClick={() => {onClickExpandAll()}}>
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

  const fragmentGuests = () => {
    return (
      <div className={`${columnItemListStyles}`}>
        {APP_STATE.guestList
          .sort((A: Guest, B: Guest) => {
            if (!Helpers.isExpiredVisit(A) && Helpers.isExpiredVisit(B)) {
              return -1;
            }
            if (!Helpers.isExpiredVisit(B) && Helpers.isExpiredVisit(A)) {
              return 1;
            }
            return A.createdAt - B.createdAt;
  }         )
          .map((guest: Guest, index: number) =>
            <GuestListItem guest={guest} key={guest.id} index={index}></GuestListItem>
          )
        }
      </div>
    )
  }

  return (
    <div className={`${mainColumnStyles}`}>
      {fragmentSwimlaneHeader()}
      <div className={`${mainStyles.column} ${mainColumnContentStyles}`}>
        {fragmentGuests()}
      </div>
    </div>
  )
}
