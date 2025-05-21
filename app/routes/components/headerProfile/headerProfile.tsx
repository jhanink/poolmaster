import { Dialog, DialogBackdrop } from "@headlessui/react";
import { dialogBackdropStyles } from "~/util/GlobalStylesUtil";
import ProfileMenu from "../profileMenu/ProfileMenu";
import { useAtom } from "jotai";
import { profileMenuOpenAtom } from "~/appStateGlobal/atoms";

export default function HeaderProfile() {
  const [PROFILE_MENU_OPEN, setProfileMenuOpen] = useAtom(profileMenuOpenAtom);

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!PROFILE_MENU_OPEN);
  }

  return (
    <>
      <div className="flex-1" style={{flexBasis: '100%'}}></div>
      <div className={`${PROFILE_MENU_OPEN ? '' : 'hidden'} drop-shadow-xl divide-y divide-gray-200`}>
        <Dialog open={PROFILE_MENU_OPEN} onClose={()=>{}}>
          <DialogBackdrop transition className={`${dialogBackdropStyles}`} onClick={toggleProfileMenu}/>
          <div className="absolute top-3 right-3 z-50">
            <ProfileMenu toggle={toggleProfileMenu}/>
          </div>
        </Dialog>
      </div>
      <div className={`flex-1 relative`}>
        <div className={`${!PROFILE_MENU_OPEN ? '' : 'hidden'} flex items-center justify-center space-x-2 w-8 h-8 shrink-0 rounded-full bg-gray-300 hover:cursor-pointer`}
          onClick={toggleProfileMenu}>
          <span className="text-sm text-gray-900">
            SVB
          </span>
        </div>
      </div>
    </>
  )
}
