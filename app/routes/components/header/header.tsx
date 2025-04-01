import { Dialog, DialogBackdrop } from "@headlessui/react";
import ProfileMenu from "../profileMenu/ProfileMenu";
import { useAtom } from "jotai";
import { type ListFilterType, appStateAtom, dndGuestToAssignTableAtom, guestFormOpenAtom, manageTablesAtom, profileMenuOpenAtom, selectedListFilterAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { Helpers } from "~/util/Helpers";
import { buttonHoverRing, dialogBackdropStyles} from "~/util/GlobalStylesUtil";
import { useDrop } from 'react-dnd';
import { type Guest } from "~/config/AppState";

const statusPillStyles = `mr-2 font-bold`;
const selectedFilterStyle = `ring-2 ring-white border-transparent`;

// className={`${dropTargetDefaultStyle} ${canDrop ? (isOver? dropTargetOverStyle : dropTargetActiveStyle) : ''}`}
const dndTargetBaseStyle = `flex justify-center text-gray-500 py-2 pb-2 text-sm select-none`;
export const dndVerticalActiveStyle = `phone:bg-green-300 phone:invert`;
export const dndVerticalOverStyle = `phone:blur-[2px] phone:bg-white`;
export const dndActiveStyle = `bg-green-300 invert`;
export const dndOverStyle = `blur-[2px] bg-white`;

export default function AppHeader() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [PROFILE_MENU_OPEN, setProfileMenuOpen] = useAtom(profileMenuOpenAtom);
  const [IS_MANAGE_TABLES] = useAtom(manageTablesAtom);
  const [SELECTED_LIST_FILTER, setSelectedListFilter] = useAtom(selectedListFilterAtom);
  const [, setSelectedTable] = useAtom(selectedTableAtom);
  const [, setGuestFormOpen] = useAtom(guestFormOpenAtom);
  const [DND_GUEST, setDndGuestToAssignTable] = useAtom(dndGuestToAssignTableAtom);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'GUEST_ITEM', // MUST match the 'type' from useDrag
    drop: (item: {guest: Guest}, monitor) => {
        if(monitor.canDrop()){;
          setDndGuestToAssignTable(item.guest);
          setSelectedTable(undefined);
          setSelectedListFilter('');
          setGuestFormOpen(false);
        }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(), // Is an item being dragged over this target?
      canDrop: !!monitor.canDrop(), // Can the item be dropped here? (Based on 'accept')
    }),
  }));

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!PROFILE_MENU_OPEN);
  }

  const onClickListFilter = (type: ListFilterType) => {
    if (type === SELECTED_LIST_FILTER) {
      setSelectedListFilter('');
    } else {
      setSelectedListFilter(type);
    }
    setSelectedTable(undefined);
  }

  return (
    <>
      <div className="flex items-center relative text-center border-b border-t border-zinc-800 p-1 select-none">
        <div className="flex-1 m-3 text-left text-nowrap">
          <div className="text-md text-gray-200">{APP_STATE.account?.venue}</div>
        </div>
        <div className="flex-1" style={{flexBasis: '100%'}}></div>
        <div className={`${PROFILE_MENU_OPEN ? '' : 'hidden'} drop-shadow-xl divide-y divide-gray-200`}>
          <Dialog open={PROFILE_MENU_OPEN} onClose={()=>{}}>
            <DialogBackdrop transition className={`${dialogBackdropStyles}`} onClick={toggleProfileMenu}/>
            <div className="absolute top-3 right-3 z-50 motion-preset-slide-down motion-duration-500">
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
      </div>
      {!IS_MANAGE_TABLES && !DND_GUEST && <>
        <div ref={drop as unknown as React.Ref<HTMLDivElement>}
            className={`
              ${dndTargetBaseStyle}
              ${canDrop &&  (isOver ? dndOverStyle : dndActiveStyle)}
            `}>
          {/* <span className={`py-[2px] mx-2 text-yellow-400`}>
            <span className={`${statusPillStyles}`}>{Helpers.reservations(APP_STATE).length}</span>
            <span>RSVP</span>
          </span> */}
          <span className={`${buttonHoverRing} ${SELECTED_LIST_FILTER === 'waitlist' ? selectedFilterStyle : ''}  py-1 px-2 mx-2 border border-gray-500 text-blue-500 rounded-full hover:cursor-pointer`} onClick={(event) => onClickListFilter('waitlist')}>
            <span className={`${statusPillStyles}`}>{APP_STATE.guestList.length}</span>
            <span>WAITING</span>
          </span>
          <span className={`${buttonHoverRing} ${SELECTED_LIST_FILTER === 'tablelist' ? selectedFilterStyle : ''} py-1 px-2 mx-2 border border-gray-500 text-green-600 rounded-full hover:cursor-pointer`} onClick={(event) => onClickListFilter('tablelist')}>
            <span className={`${statusPillStyles}`}>{Helpers.tablesAssigned(APP_STATE).length}</span>
            <span>ACTIVE</span>
          </span>
          {/* <span className={`py-1 mx-2 text-gray-500`}>
            <span className={`${statusPillStyles}`}>{Helpers.tablesAvailable(APP_STATE).length}</span>
            <span>OPEN</span>
          </span> */}
        </div>
      </>}
      {IS_MANAGE_TABLES && <>
        <div className="flex justify-center border-b rounded-lg my-3 mx-1 border-zinc-800 py-3 text-white text-xl uppercase bg-gray-800">
          Manage Tables
        </div>
      </>}
    </>
  );
}
