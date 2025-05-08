import { useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";
import { appStateAtom, mainTakoverAtom } from "~/appStateGlobal/atoms";
import type { Account, Billing } from "~/config/AppState";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles } from "~/util/GlobalStylesUtil";
import { fragmentWelcomeMessage, fragmentAppName, fragmentExitTakeover } from "../../fragments/fragments";
import AdminSectionTables from "./adminSectionTables";
import AdminSectionAccount from "./adminSectionAccount";
import AdminBilling from "./adminBilling";
import AdminBillingSchedules from "./adminBillingSchedules";

export const ADMIN_SECTION = `text-left`;
export const ADMIN_HEADER = `text-2xl py-2 px-5 text-purple-500 mx-2 border border-gray-800 rounded-lg w-full`;
export const ADMIN_CONTENT = `p-5 text-sm `;
export const ADMIN_ACTIONS = `text-left`;
export const ADMIN_ACTION_BUTTONS = `${actionButtonStyles} !py-0`

export default function AdminTakeover() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [, setMainTakeover] = useAtom(mainTakoverAtom);

  const PageTopRef = useRef<HTMLDivElement>(null);

  const onClickExit = () => {
    setMainTakeover(undefined);
  }

  useEffect(() => {
    PageTopRef.current && PageTopRef.current.scrollIntoView();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center text-center" ref={PageTopRef}>
      {!!APP_STATE.modifiedAt && (
        fragmentExitTakeover(onClickExit)
      )}
      <div className="CONTENT pt-5 relative">
        {!APP_STATE.modifiedAt && (
          fragmentWelcomeMessage()
        )}
        <div>
          {!!APP_STATE.modifiedAt && (
            <h1>{fragmentAppName('text-2xl ml-2')}</h1>
          )}
          <h1 className="text-2xl text-gray-300 pb-10 pt-3">Admin Console</h1>
        </div>
        <div className="text-center mb-20">
          <AdminSectionTables/>
          <hr className="text-gray-900 my-5"/>
          <AdminSectionAccount/>
          <hr className="text-gray-900 my-5"/>
          <AdminBilling/>
          <hr className="text-gray-900 my-5"/>
          <AdminBillingSchedules/>

        </div>
      </div>
    </div>
  );
}
