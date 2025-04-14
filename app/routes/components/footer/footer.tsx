import { CogIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { guestFormOpenAtom, mainTakoverAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { actionIconStyles } from "~/util/GlobalStylesUtil";

export default function AppFooter() {

  const [, setGuestListFormOpen] = useAtom(guestFormOpenAtom);
  const [, setSelectedTable] = useAtom(selectedTableAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);

  const onClickSettings = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setGuestListFormOpen(false);
    setSelectedTable(undefined);
    setMainTakeover({adminScreen: true});
  }

  return (
    <div className="flex mt-2 pt-2 mb-2 text-center text-nowrap text-sm border-t justify-center items-center
      border-gray-900">
        {!MAIN_TAKEOVER?.adminScreen && !MAIN_TAKEOVER?.closeoutTable && (
        <span className={`inline-block ${actionIconStyles}`}
          onClick={onClickSettings}>
          <CogIcon className="size-[20px] relative top-[-1px] hover:text-yellow-500 text-gray-500"></CogIcon>
        </span>
      )}
      <span className="text-gray-600 ml-3">POOL</span>
      <span className="text-sm">🎱</span>
      <span className="text-red-500">MASTER</span>
      <span className="text-gray-600 ml-3">2025</span>
    </div>
  )
}
