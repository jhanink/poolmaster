import TableList from "./tableList/tableList";
import GuestList from "./guestList/guestList";
import { useAtom } from "jotai";
import { appStateAtom, isQuietModeAtom, mainTakoverAtom, selectedListFilterAtom } from "~/appStateGlobal/atoms";
import AssignTable from "../mainTakeover/assignTable/assignTable";
import TableCloseout from "../mainTakeover/tableCloseout/tableCloseout";
import Admin from "../mainTakeover/admin/admin";
import AddGuest from "../mainTakeover/addGuest/addGuest";
import EditGuest from "../mainTakeover/editGuest/editGuest";
import styles from "./mainStyles.module.css"
import { separatorBarStyles } from "~/util/GlobalStylesUtil";
import { Helpers } from "~/util/Helpers";

export default function AppMain() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [SELECTED_LIST_FILTER] = useAtom(selectedListFilterAtom);
  const [MAIN_TAKEOVER] = useAtom(mainTakoverAtom);
  const [QUIET_MODE] = useAtom(isQuietModeAtom);

  return (
    <div className={`flex flex-col grow max-w-[1400px]`}>
      {MAIN_TAKEOVER?.closeoutTable && <TableCloseout></TableCloseout>}
      {MAIN_TAKEOVER?.assignTableGuest && <AssignTable></AssignTable>}
      {MAIN_TAKEOVER?.adminScreen && <Admin></Admin>}
      {MAIN_TAKEOVER?.addGuest && <AddGuest></AddGuest>}
      {MAIN_TAKEOVER?.editGuest && <EditGuest></EditGuest>}

      {!MAIN_TAKEOVER && !QUIET_MODE &&
        <div className={`${styles.mainContent} pt-0 gap-5 md:mx-3 grow justify-center`}>
          {(SELECTED_LIST_FILTER !== "tablelist") && (
            <GuestList></GuestList>
          )}

          {!Helpers.isEmptyListData(APP_STATE) && (
            <hr className={`${separatorBarStyles} mt-4`}/>
          )}

          {(SELECTED_LIST_FILTER !== "waitlist") && (
            <TableList></TableList>
          )}
        </div>
      }
    </div>
  )
}
