import { CogIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { mainTakoverAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { actionIconStyles } from "~/util/GlobalStylesUtil";

const footerStyles = `flex items-center justify-center !text-xs mb-0 mt-2 select-none`;
const adminCogStyles = `size-[16px] relative top-[1px] hover:text-white text-gray-500`;

export default function BrandingBar() {
  const [, setSelectedTable] = useAtom(selectedTableAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);

  const onClickSettings = () => {
    if (!!MAIN_TAKEOVER) return;
    setSelectedTable(undefined);
    setMainTakeover({adminScreen: true});
  }

  return (
    <div className={`${footerStyles}`}>
      <span
        className={`inline-block ${actionIconStyles}`}
        onClick={onClickSettings}>
        <CogIcon className={`${adminCogStyles} ${MAIN_TAKEOVER?.adminScreen && 'text-white'}`}></CogIcon>
      </span>
      <span className="text-gray-600 ml-1">POOLHALL</span>
      <span className="text-gray-400">MASTER</span>
      <span className="text-gray-600 ml-2">2025</span>
    </div>
  )
}
