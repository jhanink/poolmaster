import TableList from "./tableList/tableList";
import GuestList from "./guestList/guestList";
import { useAtom } from "jotai";
import { Helpers } from "~/util/Helpers";
import { appStateAtom, mainTakoverAtom, selectedListFilterAtom } from "~/appStateGlobal/atoms";
import AssignTable from "../mainTakeover/assignTable/assignTable";
import TableCloseout from "../mainTakeover/tableCloseout/tableCloseout";
import Admin from "../mainTakeover/admin/admin";
import AddGuest from "../mainTakeover/addGuest/addGuest";
import EditGuest from "../mainTakeover/editGuest/editGuest";
import styles from "./mainStyles.module.css"

export default function AppMain() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [SELECTED_LIST_FILTER] = useAtom(selectedListFilterAtom);
  const [MAIN_TAKEOVER] = useAtom(mainTakoverAtom);

  return (
    <div className={`grow`}>
      {MAIN_TAKEOVER?.closeoutTable && <TableCloseout></TableCloseout>}
      {MAIN_TAKEOVER?.assignTable && <AssignTable></AssignTable>}
      {MAIN_TAKEOVER?.adminScreen && <Admin></Admin>}
      {MAIN_TAKEOVER?.addGuest && <AddGuest></AddGuest>}
      {MAIN_TAKEOVER?.editGuest && <EditGuest></EditGuest>}

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
