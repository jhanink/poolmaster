import styles from "./mainStyles.module.css";
import TableList from "./tableList/tableList";
import GuestList from "./guestList/guestList";
import { useAtom } from "jotai";
import { appStateAtom, mainTakoverAtom, selectedListFilterAtom } from "~/appStateGlobal/atoms";
import { DndGuestAssignTable } from "../mainTakeover/dndGuestAssignTable/DndGuestAssignTable";
import TableCloseout from "../mainTakeover/tableCloseout/tableCloseout";
import Admin from "../mainTakeover/admin/admin";
import { Helpers } from "~/util/Helpers";

export default function AppMain() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [SELECTED_LIST_FILTER] = useAtom(selectedListFilterAtom);
  const [MAIN_TAKEOVER] = useAtom(mainTakoverAtom);

  return (
    <div className={`${styles.mainContainer} grow`}>
      {MAIN_TAKEOVER?.closeoutTable && <TableCloseout></TableCloseout>}
      {MAIN_TAKEOVER?.dndGuest && <DndGuestAssignTable></DndGuestAssignTable>}
      {MAIN_TAKEOVER?.adminScreen && <Admin></Admin>}

      {!MAIN_TAKEOVER?.dndGuest && !MAIN_TAKEOVER?.closeoutTable && !MAIN_TAKEOVER?.adminScreen &&
        <div className={`${styles.mainContent} mx-3 pt-0 gap-x-4`}>
          {!(SELECTED_LIST_FILTER === "tablelist") && <>
            <GuestList></GuestList>
          </>}
          {!(SELECTED_LIST_FILTER === "waitlist") && <>
            {(!!Helpers.tablesAssigned(APP_STATE).length || SELECTED_LIST_FILTER === "tablelist") && (
              <TableList></TableList>
            )}
          </>}
        </div>
      }
    </div>
  )
}
