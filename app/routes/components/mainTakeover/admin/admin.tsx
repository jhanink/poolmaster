import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { appStateAtom, mainTakoverAtom } from "~/appStateGlobal/atoms";
import { actionButtonStyles } from "~/util/GlobalStylesUtil";
import { fragmentWelcomeMessage, fragmentAppName, fragmentExitTakeover } from "../../fragments/fragments";
import AdminTables from "./adminTables";
import AdminAccount from "./adminAccount";
import AdminTableRates from "./adminTableRates";
import AdminTableTypes from "./adminTableTypes";

export const ADMIN_SECTION = `text-left`;
export const ADMIN_HEADER = `text-2xl mb-2 py-2 px-5 text-black bg-gray-300 rounded-lg w-full`;
export const ADMIN_CONTENT = `text-sm `;
export const ADMIN_ACTIONS = `text-left`;
export const ADMIN_ACTION_BUTTONS = `${actionButtonStyles} !py-0 !text-black`

export default function Admin() {
  const [APP_STATE] = useAtom(appStateAtom);
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
          <AdminAccount/>
          <hr className="text-gray-900 my-5"/>
          <AdminTableTypes/>
          <hr className="text-gray-900 my-5"/>
          <AdminTableRates/>
          <hr className="text-gray-900 my-5"/>
          <AdminTables/>
        </div>
      </div>
    </div>
  );
}
