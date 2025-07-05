import { HomeIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { mainTakoverAtom } from "~/appStateGlobal/atoms";

const brandStyles = `flex items-center justify-center !text-xs mb-1 mt-3 select-none`;
const headerActionIconStyles = `size-[16px] hover:text-white hover:cursor-pointer text-gray-500`;

export default function BrandingBar() {
  const [, setMainTakeover] = useAtom(mainTakoverAtom);

  const onClickHome = async () => {
    setMainTakeover({homeRedirect: true});
  }

  return (
    <div className={`${brandStyles} hover:cursor-pointer`} onClick={onClickHome}>
      <div className="text-gray-600 ml-1">POOLHALL</div>
      <div className="text-gray-400">MASTER</div>
      <div className="text-gray-600 ml-2">2025</div>
      <div className={`ml-2`}>
        <HomeIcon className={`${headerActionIconStyles}`} title="Refresh"/>
      </div>
    </div>
  )
}
