import { actionButtonStyles, formSelectStyles, ITEM, largePartyStylesOptions, optionStyles, ROW } from "~/util/GlobalStylesUtil";
import { ADMIN_ACTIONS, ADMIN_CONTENT, ADMIN_HEADER, ADMIN_HEADER_STICKY, ADMIN_SECTION } from "./admin";
import { DefaultStatusIndicators, LARGE_PARTY_SIZE_ARRAY} from "~/config/AppState";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { appStateAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";
import ModalConfirm from "../../ui-components/modal/modalConfirm";

const partySizeArray = [...LARGE_PARTY_SIZE_ARRAY];
const borderColor = 'border-teal-500';
const bgColor = 'bg-teal-500';

export default function AdminSettings() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [STATUS_INDICATORS, setStatusIndicators] = useState(DefaultStatusIndicators);
  const [SHOW_CONFIRM_SAVE, setShowConfirmSave] = useState(false);

  const onClickResetForm = () => {
    setStatusIndicators({...APP_STATE.statusIndicators});
  }

  const onClickSaveItem = () => {
    const newState = {
      ...APP_STATE,
      statusIndicators: STATUS_INDICATORS,
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
      <div className={`${ADMIN_HEADER_STICKY} ${borderColor}`}>
        <div className={`${ADMIN_HEADER} ${bgColor}`}>
          <div className={`flex items-center`}>
            <div>Settings</div>
          </div>
        </div>
        <div className={`${ADMIN_ACTIONS}`}>
          <button className={`${actionButtonStyles}`} onClick={onClickResetForm}>Reset</button>
          <button className={`${actionButtonStyles}`} onClick={() => {setShowConfirmSave(true)} }>Save</button>
        </div>
      </div>
      <div className={`${ADMIN_CONTENT}`}>
        <div className={`${ITEM} ${borderColor}`}>
          <div className={`${ROW} text-gray-400 `}>
            Large Party Size & Color:
          </div>
          <div className={`${ROW}`}>
            <select
              onChange={(event) => {
                STATUS_INDICATORS.largePartySize = Number(event.target.value);
                setStatusIndicators({...STATUS_INDICATORS});
              }}
              value={STATUS_INDICATORS.largePartySize}
              className={`${formSelectStyles} pb-3`}
            >
              {partySizeArray.map((size) => (
                <option key={size} className={optionStyles} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className={`${ROW}`}>
            <select
              onChange={(event) => {
                STATUS_INDICATORS.largePartyStyle = Number(event.target.value);
                setStatusIndicators({...STATUS_INDICATORS});
              }}
              value={STATUS_INDICATORS.largePartyStyle}
              className={`${formSelectStyles} pb-3`}
            >
              {largePartyStylesOptions.map((style) => (
                <option key={style.id} className={optionStyles} value={style.id}>{style.name}</option>
              ))}
            </select>
          </div>
          <div className={`mt-3 uppercasetext-nowrap`}>
            <div className={`inline-block ${largePartyStylesOptions[STATUS_INDICATORS.largePartyStyle - 1].style} text-gray-200`}>
              Samantha : {STATUS_INDICATORS.largePartySize}
            </div>

          </div>
        </div>
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
