import styles from "./mainStyles.module.css";
import TableList from "./tableList/tableList";
import GuestList from "./guestList/guestList";
import { useAtom } from "jotai";
import { Helpers } from "~/util/Helpers";
import { appStateAtom, mainTakoverAtom, selectedListFilterAtom } from "~/appStateGlobal/atoms";
import AssignTableTakeover from "../mainTakeover/assignTable/assignTableTakeover";
import TableCloseoutTakeover from "../mainTakeover/tableCloseout/tableCloseoutTakeover";
import AdminTakeover from "../mainTakeover/admin/adminTakeover";

import AddGuestTakeover from "../mainTakeover/addGuest/addGuestTakeover";

export default function AppMain() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [SELECTED_LIST_FILTER] = useAtom(selectedListFilterAtom);
  const [MAIN_TAKEOVER] = useAtom(mainTakoverAtom);

  return (
    <div className={`${styles.mainContainer} grow`}>
      {MAIN_TAKEOVER?.closeoutTable && <TableCloseoutTakeover></TableCloseoutTakeover>}
      {MAIN_TAKEOVER?.assignTable && <AssignTableTakeover></AssignTableTakeover>}
      {MAIN_TAKEOVER?.adminScreen && <AdminTakeover></AdminTakeover>}
      {MAIN_TAKEOVER?.addGuest && <AddGuestTakeover></AddGuestTakeover>}

      {!MAIN_TAKEOVER &&
        <div className={`${styles.mainContent} mx-3 pt-0 gap-x-4`}>
          {(SELECTED_LIST_FILTER !== "tablelist") && (
            <GuestList></GuestList>
          )}
          {(SELECTED_LIST_FILTER !== "waitlist") && (!!Helpers.tablesAssigned(APP_STATE).length || SELECTED_LIST_FILTER === "tablelist") && (
            <TableList></TableList>
          )}
        </div>
      }
    </div>
  )
}
