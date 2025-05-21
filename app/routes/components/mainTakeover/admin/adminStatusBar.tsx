import { actionButtonStyles, formInputStylesSmall, formSelectStyles, ITEM, optionStyles, ROW } from "~/util/GlobalStylesUtil";
import { ADMIN_ACTIONS, ADMIN_HEADER, ADMIN_SECTION } from "./admin";
import { DefaultStatusBar, LARGE_PARTY_SIZE_ARRAY} from "~/config/AppState";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { appStateAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";
import ModalConfirm from "../../ui-components/modal/modalConfirm";

const partySizeArray = [...LARGE_PARTY_SIZE_ARRAY];

export default function AdminStatusBar() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [STATUS_BAR, setStatusBar] = useState(DefaultStatusBar);
  const [SHOW_CONFIRM_SAVE, setShowConfirmSave] = useState(false);

  const onClickResetForm = () => {
    setStatusBar({...APP_STATE.statusBar});
  }

  const onClickSaveItem = () => {
    const newState = {
      ...APP_STATE,
      statusBar: STATUS_BAR,
    }
    AppStorage.setAppStateRemote(newState);
    setAppState(newState);
    setShowConfirmSave(false)
  }

  useEffect(() => {
    onClickResetForm();
  }, []);

  return (<>
    <div className={`${ADMIN_SECTION}`}>
      <h2 className={`${ADMIN_HEADER}`}>
        Status Bar
      </h2>
      <div className={`${ITEM} ${ROW}`}>
        <span className="text-gray-400 mr-2">
          Large Party Size:
        </span>
        <select
          onChange={(event) => {
            STATUS_BAR.largePartySize = Number(event.target.value);
            setStatusBar({...STATUS_BAR});
          }}
          value={STATUS_BAR.largePartySize}
          className={`${formSelectStyles} pb-3`}
        >
          {partySizeArray.map((size) => (
            <option key={size} className={optionStyles} value={size}>{size}</option>
          ))}
        </select>
      </div>
      <div className={`!text-right ${ADMIN_ACTIONS}`}>
        <button className={`${actionButtonStyles}`} onClick={onClickResetForm}>Reset</button>
        <button className={`${actionButtonStyles}`} onClick={() => {setShowConfirmSave(true)} }>Save</button>
      </div>
    </div>
    <ModalConfirm
      show={SHOW_CONFIRM_SAVE}
      dialogTitle={`SAVE STATUS BAR`}
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
