import styles from "./mainStyles.module.css";
import TableList from "./tableList/tableList";
import GuestList from "./guestList/guestList";
import { useAtom } from "jotai";
import { dndGuestToAssignTableAtom, manageTablesAtom, selectedListFilterAtom } from "~/appStateGlobal/atoms";
import { DndGuestAssignTable } from "../dndGuestAssignTable/DndGuestAssignTable";

export default function AppMain() {
  const [IS_MANAGE_TABLES] = useAtom(manageTablesAtom);
  const [SELECTED_LIST_FILTER, setSelectedListFilter] = useAtom(selectedListFilterAtom);
  const [DND_GUEST, setDndGuestToAssignTable] = useAtom(dndGuestToAssignTableAtom);

  return (
    <div className={`${styles.mainContainer} grow`}>
      {DND_GUEST && <DndGuestAssignTable></DndGuestAssignTable>}
      {!DND_GUEST &&
        <div className={`${styles.mainContent} mx-3 pt-0 gap-x-4`}>
          {!(SELECTED_LIST_FILTER === "tablelist") && !IS_MANAGE_TABLES && <>
            <GuestList></GuestList>
          </>}
          {!(SELECTED_LIST_FILTER === "waitlist") && <>
            <TableList></TableList>
          </>}
        </div>
      }
    </div>
  )
}