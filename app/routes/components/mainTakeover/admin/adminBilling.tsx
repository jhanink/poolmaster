import type { Billing } from "~/config/AppState";
import { ADMIN_ACTIONS, ADMIN_CONTENT, ADMIN_HEADER, ADMIN_SECTION } from "./adminTakeover";
import { actionButtonStyles, formFieldStyles, optionStyles } from "~/util/GlobalStylesUtil";
import { useAtom } from "jotai";
import { appStateAtom } from "~/appStateGlobal/atoms";
import { useEffect, useState } from "react";
import { AppStorage } from "~/util/AppStorage";

export default function AdminBilling() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [BILLING, setBilling] = useState({defaultBillingRate: ''} as Billing);

  const onClickResetBilling = (event: any) => {
    setBilling({...APP_STATE.billing});
  }

  const onClickSaveBilling = (event: any) => {
    const newState = {
      ...APP_STATE,
      billing: BILLING,
    }
    AppStorage.setAppStateRemote(newState);
    setAppState(newState);
  }

  useEffect(() => {
    onClickResetBilling({} as any);
  }, []);

  return (<>
    <div className={`${ADMIN_SECTION}`}>
      <h2 className={`${ADMIN_HEADER}`}>
        Billing
      </h2>
      <div className={`${ADMIN_CONTENT}`}>
        <div>
          <span className="text-gray-400 mr-2">
            Selected Schedule:
          </span>
          <select
            onChange={(event) => {
              BILLING.selectedScheduleId = Number(event.target.value);
              setBilling({...BILLING})
            }}
            value={BILLING.selectedScheduleId}
            className={`${formFieldStyles}`}
          >
            {APP_STATE.billingSchedules.map((schedule) => (
              <option key={schedule.id} className={optionStyles} value={schedule.id}>{schedule.name}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="text-gray-400 mr-2">
            Default Hourly Rate:
          </span>
          <input
            value={BILLING.defaultBillingRate}
            placeholder="Rate..."
            maxLength={6}
            className={`w-[100px] ${formFieldStyles}`}
            onChange={(event) => {
              BILLING.defaultBillingRate = event.target.value;
              setBilling({...BILLING});
            }}
          />
        </div>
      </div>
      <div className={`${ADMIN_ACTIONS}`}>
        <button className={`${actionButtonStyles}`} onClick={onClickResetBilling}>Reset</button>
        <button className={`${actionButtonStyles}`} onClick={onClickSaveBilling}>Save</button>
      </div>
    </div>
  </>)
}