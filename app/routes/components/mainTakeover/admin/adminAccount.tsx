import { actionButtonStyles, formFieldStyles, formInputStyles, ITEM, labelStyles, ROW } from "~/util/GlobalStylesUtil";
import { ADMIN_ACTIONS, ADMIN_CONTENT, ADMIN_HEADER, ADMIN_HEADER_STICKY, ADMIN_SECTION } from "./admin";
import { DefaultAccountData } from "~/config/AppState";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { appStateAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";
import ModalConfirm from "../../ui-components/modal/modalConfirm";

const borderColor = '!border-sky-300';
const bgColor = 'bg-sky-300';

export default function AdminAccount(props: {
  ref: React.RefObject<HTMLDivElement>;
}) {
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
    <div className={`${ADMIN_SECTION}`} ref={props.ref}>
      <div className={`${ADMIN_HEADER_STICKY} ${borderColor}`}>
        <div className={`${ADMIN_HEADER} ${bgColor}`}>
          <div className={`flex items-center`}>
            <div>Account</div>
          </div>
        </div>
        <div className={`${ADMIN_ACTIONS}`}>
          <button className={`${actionButtonStyles}`} onClick={onClickResetForm}>Reset</button>
          <button className={`${actionButtonStyles}`} onClick={() => {setShowConfirmSave(true)} }>Save</button>
        </div>
      </div>
      <div className={`${ADMIN_CONTENT}`}>
        <div className={`${ITEM} ${borderColor}`}>
          <div className={`${ROW}`}>
            <div className={`${labelStyles}`}>
              Venue:
            </div>
            <input
              className={`
                ${formInputStyles}
                ${formFieldStyles}
                max-w-3/4
              `}
              value={ACCOUNT.venue}
              placeholder="Account name..."
              maxLength={70}
              onChange={(event) => {
                ACCOUNT.venue = event.target.value;
                setAccount({...ACCOUNT});
              }}
            />
          </div>
        </div>
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
