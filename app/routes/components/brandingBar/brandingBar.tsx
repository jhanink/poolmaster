import { HomeIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { mainTakoverAtom } from "~/appStateGlobal/atoms";

const brandStyles = `flex items-center justify-center !text-xs mb-0 mt-2 select-none`;
const headerActionIconStyles = `size-[16px] hover:text-white hover:cursor-pointer text-gray-500`;

export default function BrandingBar() {
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);

  const onClickHome = async () => {
    setMainTakeover({homeRedirect: true});
  }

  return (
    <div className={`${brandStyles}`}>
      <div className="text-gray-600 ml-1">POOLHALL</div>
      <div className="text-gray-400">MASTER</div>
      <div className="text-gray-600 ml-2">2025</div>
      <div
        className={`ml-2`}
        onClick={onClickHome}
      >
        <HomeIcon className={`${headerActionIconStyles}`} title="Refresh"/>
      </div>
    </div>
  )
}
