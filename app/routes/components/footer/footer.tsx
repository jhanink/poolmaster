import { CogIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { mainTakoverAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { actionIconStyles, footerStyles } from "~/util/GlobalStylesUtil";

export default function AppFooter() {
  const [, setSelectedTable] = useAtom(selectedTableAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);

  const onClickSettings = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedTable(undefined);
    setMainTakeover({adminScreen: true});
  }

  return (
    <div className={`${footerStyles}`}>
        {!MAIN_TAKEOVER && (
        <span className={`inline-block ${actionIconStyles}`}
          onClick={onClickSettings}>
          <CogIcon className="size-[20px] relative top-[-1px] hover:text-yellow-500 text-gray-500"></CogIcon>
        </span>
      )}
      <span className="text-gray-600 ml-3">POOLHALL</span>
      <span className="text-red-500">MASTER</span>
      <span className="text-gray-600 ml-3">2025</span>
    </div>
  )
}
