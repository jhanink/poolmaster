import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { appStateAtom, mainTakoverAtom } from "~/appStateGlobal/atoms";
import { actionButtonStyles } from "~/util/GlobalStylesUtil";
import { fragmentWelcomeMessage, fragmentExitTakeover } from "../../fragments/fragments";
import AdminTables from "./adminTables";
import AdminAccount from "./adminAccount";
import AdminTableRates from "./adminTableRates";
import AdminTableTypes from "./adminTableTypes";
import AdminUsageTypes from "./adminUsageTypes";
import AdminSettings from "./adminSettings";
import AdminRateSchedules from "./adminRateSchedules";
import AdminActions from "./adminActions";

export const ADMIN_SECTION = `text-left mb-2`;
export const ADMIN_HEADER = `text-xl py-2 px-5 text-black rounded-lg relative p-3 z-1`;
export const ADMIN_HEADER_STICKY = `sticky top-[44px] border rounded-lg mb-2 bg-black z-1 w-[320px]`;
export const ADMIN_CONTENT = `text-sm pb-3 mb-20`;
export const ADMIN_ACTIONS = `flex items-center justify-center bg-black text-left py-2 my-1 z-1`;
export const ADMIN_ACTION_BUTTONS = `${actionButtonStyles} !py-0 !text-black`;

const actionsSeparatorStyles = "border-b border-gray-500 my-5";

export default function Admin() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [, setMainTakeover] = useAtom(mainTakoverAtom);
  const [SHOW_ACTIONS, setShowActions] = useState(false);

  const PageTopRef = useRef<HTMLDivElement>(null);

  const onClickExit = () => {
    setShowActions(false);
    setMainTakeover(undefined);
  }

  useEffect(() => {
    PageTopRef.current && PageTopRef.current.scrollIntoView();
  }, []);

  return (
    <div className="text-center" ref={PageTopRef}>
      {(
        fragmentExitTakeover(onClickExit)
      )}
      <div className="CONTENT">
        {!APP_STATE.modifiedAt && (
          fragmentWelcomeMessage()
        )}
        <div>
          <h1 className="text-xl text-gray-300 pb-10 pt-3">Admin Console</h1>
        </div>
        <div className="text-center mb-20 inline-block">
          <AdminAccount/>
          <AdminSettings/>
          <AdminTableRates/>
          <AdminRateSchedules/>
          <AdminUsageTypes/>
          <AdminTableTypes/>
          <AdminTables/>
          <hr className={actionsSeparatorStyles}/>
          <button className={actionButtonStyles} onClick={() => {setShowActions( !SHOW_ACTIONS)}}>
            Show Admin Actions
          </button>
          {SHOW_ACTIONS && (
            <div>
              <hr className={actionsSeparatorStyles}/>
              <AdminActions/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
