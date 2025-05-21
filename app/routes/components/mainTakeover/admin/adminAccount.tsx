import { actionButtonStyles, formFieldStyles, formInputStyles, ITEM, ROW } from "~/util/GlobalStylesUtil";
import { ADMIN_ACTIONS, ADMIN_HEADER, ADMIN_SECTION } from "./admin";
import { DefaultAccountData, type Account} from "~/config/AppState";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { appStateAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";
import ModalConfirm from "../../ui-components/modal/modalConfirm";

export default function AdminAccount() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [ACCOUNT, setAccount] = useState(DefaultAccountData);
  const [SHOW_CONFIRM_SAVE, setShowConfirmSave] = useState(false);

  const onClickResetForm = () => {
    setAccount({...APP_STATE.account});
  }

  const onClickSaveItem = () => {
    const newState = {
      ...APP_STATE,
      account: ACCOUNT,
    }
    AppStorage.setAppStateRemote(newState);
    setAppState(newState);
    setShowConfirmSave(false);
  }

  useEffect(() => {
    onClickResetForm();
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
      <div className={`!text-right ${ADMIN_ACTIONS}`}>
        <button className={`${actionButtonStyles}`} onClick={onClickResetForm}>Reset</button>
        <button className={`${actionButtonStyles}`} onClick={() => {setShowConfirmSave(true)} }>Save</button>
      </div>
    </div>
    <ModalConfirm
      show={SHOW_CONFIRM_SAVE}
      dialogTitle={`SAVE ACCOUNT`}
      dialogMessageFn={() => (
        <span className="text-base">
          <div className="mt-3 text-xl text-gray-200">Are you sure?</div>
        </span>
      )}
      onConfirm={() => {onClickSaveItem()}}
      onCancel={() => {setShowConfirmSave(false)}}
    />
  </>)
}
