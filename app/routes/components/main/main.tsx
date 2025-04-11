import styles from "./mainStyles.module.css";
import TableList from "./tableList/tableList";
import GuestList from "./guestList/guestList";
import { useAtom } from "jotai";
import { adminScreenAtom, dndGuestToAssignTableAtom, guestCheckoutAtom, selectedListFilterAtom } from "~/appStateGlobal/atoms";
import { DndGuestAssignTable } from "../interstitial/dndGuestAssignTable/DndGuestAssignTable";
import GuestCheckout from "../interstitial/guestCheckout/guestCheckout";
import Admin from "../admin/admin";

export default function AppMain() {
  const [SELECTED_LIST_FILTER] = useAtom(selectedListFilterAtom);
  const [DND_GUEST] = useAtom(dndGuestToAssignTableAtom);
  const [GUEST_CHECKOUT_STARTED] = useAtom(guestCheckoutAtom);
  const [ADMIN_SCREEN] = useAtom(adminScreenAtom);

  return (
    <div className={`${styles.mainContainer} grow`}>
      {GUEST_CHECKOUT_STARTED && <GuestCheckout></GuestCheckout>}
      {DND_GUEST && <DndGuestAssignTable></DndGuestAssignTable>}
      {ADMIN_SCREEN && <Admin></Admin>}

      {!DND_GUEST && !GUEST_CHECKOUT_STARTED && !ADMIN_SCREEN &&
        <div className={`${styles.mainContent} mx-3 pt-0 gap-x-4`}>
          {!(SELECTED_LIST_FILTER === "tablelist") && <>
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