import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { mainTakoverAtom } from "~/appStateGlobal/atoms";
import { actionButtonStyles, separatorBarStyles } from "~/util/GlobalStylesUtil";
import { fragmentExitTakeover } from "../../fragments/fragments";
import AdminTables from "./adminTables";
import AdminAccount from "./adminAccount";
import AdminTableRates from "./adminTableRates";
import AdminTableTypes from "./adminTableTypes";
import AdminUsageTypes from "./adminUsageTypes";
import AdminSettings from "./adminSettings";
import AdminRateSchedules from "./adminRateSchedules";
import AdminActions from "./adminActions";

export const ADMIN_SECTION = `text-left mb-2`;
export const ADMIN_HEADER = `text-xl py-2 px-5 text-black rounded-lg relative p-3 z-1 bg-black`;
export const ADMIN_HEADER_STICKY = `sticky top-[97px] border rounded-lg mb-2 bg-black z-1 w-[300px] z-0`;
export const ADMIN_CONTENT = `text-sm pb-3 mb-20 z-0 mx-1 w-[292px]`;
export const ADMIN_ACTIONS = `flex items-center justify-center bg-black text-left py-2 my-1 z-1`;
export const ADMIN_ACTION_BUTTONS = `${actionButtonStyles} !py-0 !text-black`;

export default function Admin() {
  const [, setMainTakeover] = useAtom(mainTakoverAtom);
  const [SHOW_ACTIONS, setShowActions] = useState(false);

  const PageTopRef = useRef<HTMLDivElement>(null);

  const menuStyles = "hover:text-white cursor-pointer";
  const menuItems1 = [
    {
      name: "Account",
      ref: PageTopRef
    },
    {
      name: "Settings",
      ref: useRef<HTMLDivElement>(null)
    },
    {
      name: "Rates",
      ref: useRef<HTMLDivElement>(null)
    },
  ]
  const menuItems2 = [
    {
      name: "Schedules",
      ref: useRef<HTMLDivElement>(null)
    },
    {
      name: "Usage",
      ref: useRef<HTMLDivElement>(null)
    },
    {
      name: "Tables",
      ref: useRef<HTMLDivElement>(null)
    },
    {
      name: "Types",
      ref: useRef<HTMLDivElement>(null)
    }
  ]

  const fragmentMenu = () => {
    return (<>
      <div className="bg-black z-9 text-xs text-gray-500 italic flex gap-2 grow justify-center py-2">
        {menuItems1.map((item, index) => {
          return (
            <div
              key={index}
              className={`text-nowrap`}
              onClick={() => {
                item.ref.current && item.ref.current.scrollIntoView(true);
              }}>
                <span className={`${menuStyles}`}>{item.name}</span>
                {index < menuItems1.length - 1 && (
                  <span className="ml-2">|</span>
                )}
            </div>
          )
        })}
      </div>
      <div className="bg-black z-9 text-xs text-gray-500 italic flex gap-2 grow justify-center pb-1">
        {menuItems2.map((item, index) => {
          return (
            <div
              key={index}
              className={`text-nowrap`}
              onClick={() => {
                item.ref.current && item.ref.current.scrollIntoView(true);
              }}>
                <span className={`${menuStyles}`}>{item.name}</span>
                {index < menuItems2.length - 1 && (
                  <span className="ml-2">|</span>
                )}
            </div>
          )
        })}
      </div>
    </>)
  }

  const onClickExit = () => {
    setShowActions(false);
    setMainTakeover(undefined);
  }

  useEffect(() => {
    PageTopRef.current && PageTopRef.current.scrollIntoView();
  }, []);

  return (
    <div className="text-center" ref={PageTopRef}>
      {fragmentExitTakeover(onClickExit, fragmentMenu)}
      <div className="CONTENT bg-black">
        <div>
          <h1 className="text-xl text-gray-300 py-3">Admin Console</h1>
        </div>
        <div className="text-center mb-20 inline-block">
          <AdminAccount ref={menuItems1[0].ref}/>
          <AdminSettings ref={menuItems1[1].ref}/>
          <AdminTableRates ref={menuItems1[2].ref}/>
          <AdminRateSchedules ref={menuItems2[0].ref}/>
          <AdminUsageTypes ref={menuItems2[1].ref}/>
          <AdminTables ref={menuItems2[2].ref}/>
          <AdminTableTypes ref={menuItems2[3].ref}/>
          <hr className={`${separatorBarStyles} !my-3`}/>
          <button className={actionButtonStyles} onClick={() => {setShowActions( !SHOW_ACTIONS)}}>
            Show Admin Actions
          </button>
          <div>
            {SHOW_ACTIONS && (<>
              <hr className={`${separatorBarStyles} !my-3`}/>
              <AdminActions/>
            </>)}
          </div>
        </div>
      </div>
    </div>
  );
}
