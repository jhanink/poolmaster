import { CogIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { adminScreenAtom, guestCheckoutAtom, guestFormOpenAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { actionIconStyles } from "~/util/GlobalStylesUtil";

export default function AppFooter() {

  const [ADMIN_SCREEN, setAdminScreen] = useAtom(adminScreenAtom);
  const [, setGuestListFormOpen] = useAtom(guestFormOpenAtom);
  const [, setSelectedTable] = useAtom(selectedTableAtom);
  const [CHECKOUT_TABLE] = useAtom(guestCheckoutAtom);

  const onClickSettings = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setGuestListFormOpen(false);
    setSelectedTable(undefined);
    setAdminScreen(true);
  }

  return (
    <div className="flex mt-2 pt-2 mb-2 text-center text-nowrap text-sm border-t justify-center items-center
      border-gray-900">
        {!ADMIN_SCREEN && !CHECKOUT_TABLE && (
        <div className={`inline-block ${actionIconStyles}`}
          onClick={onClickSettings}>
          <CogIcon></CogIcon>
        </div>
      )}
      <span className="text-gray-600 ml-3">POOL</span>
      <span className="text-sm">🎱</span>
      <span className="text-red-500">MASTER</span>
      <span className="text-gray-600 ml-3">2025</span>
    </div>
  )
}
