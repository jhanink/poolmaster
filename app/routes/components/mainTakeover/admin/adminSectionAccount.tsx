import { actionButtonStyles, formFieldStyles, formInputStyles, ITEM, ROW } from "~/util/GlobalStylesUtil";
import { ADMIN_ACTIONS, ADMIN_HEADER, ADMIN_SECTION } from "./admin";
import type { Account } from "~/config/AppState";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { appStateAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";

export default function AdminSectionAccount() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [ACCOUNT, setAccount] = useState({venue: ''} as Account);

  const onClickResetAccount = (event: any) => {
    setAccount({...APP_STATE.account});
  }

  const onClickSaveAccount = (event: any) => {
    const newState = {
      ...APP_STATE,
      account: ACCOUNT,
    }
    AppStorage.setAppStateRemote(newState);
    setAppState(newState);
  }

  useEffect(() => {
    onClickResetAccount({} as any);
  }, []);

  return (<>
    <div className={`${ADMIN_SECTION}`}>
      <h2 className={`${ADMIN_HEADER}`}>
        Account
      </h2>
      <div className={`${ITEM} ${ROW}`}>
        <span className="text-gray-400 mr-2">
          Venue:
        </span>
        <input
          className={`${formInputStyles} w-full ${formFieldStyles}`}
          value={ACCOUNT.venue}
          placeholder="Account name..."
          maxLength={70}
          onChange={(event) => {
            ACCOUNT.venue = event.target.value;
            setAccount({...ACCOUNT});
          }}
        />
      </div>
      <div className={`${ADMIN_ACTIONS}`}>
        <button className={`${actionButtonStyles}`} onClick={onClickResetAccount}>Reset</button>
        <button className={`${actionButtonStyles}`} onClick={onClickSaveAccount}>Save</button>
      </div>
    </div>
  </>)
}
