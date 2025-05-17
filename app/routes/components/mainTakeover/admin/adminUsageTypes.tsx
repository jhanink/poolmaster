import { DefaultUsageTypeData, type UsageType } from "~/config/AppState"
import { ADMIN_ACTION_BUTTONS, ADMIN_ACTIONS, ADMIN_CONTENT, ADMIN_HEADER, ADMIN_SECTION } from "./admin"
import { TrashIcon } from "@heroicons/react/24/outline"
import {
  actionButtonStyles,
  actionIconStyles,
  formFieldStyles,
  formInputStyles,
  formInputStylesSmall,
  formLabelLeftStyles,
  formSelectStyles,
  INPUT_FIELD,
  ITEM,
  optionStyles,
  ROW
} from "~/util/GlobalStylesUtil"
import ModalConfirm from "../../ui-components/modal/modalConfirm"
import { useAtom } from "jotai"
import { appStateAtom } from "~/appStateGlobal/atoms"
import { useEffect, useState } from "react"
import { AppStorage } from "~/util/AppStorage"

export default function AdminUsageTypes() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [USAGE_TYPES, setUsageTypes] = useState([] as UsageType[]);
  const [SHOW_CONFIRM_SAVE, setShowConfirmSave] = useState(false);

  const onClickResetForm = (event: any) => {
    const types = APP_STATE.usageTypes.map((type: UsageType ) => ({...type}));
    setUsageTypes(types);
  }

  const onClickSave = () => {
    const types = USAGE_TYPES
      .map((type: UsageType) => ({...type, forAdd: false}))
      .filter((type: UsageType) => !type.forDelete);

    const newState = {
      ...APP_STATE,
      usageTypes: types,
    }

    AppStorage.setAppStateRemote(newState);
    setAppState(newState);
    setUsageTypes(types);
    setShowConfirmSave(false);
  }

  const generateNewItem = (index: number = 1): UsageType => {
    const id = Date.now() + index;
    const newItem: UsageType = {
      ...DefaultUsageTypeData,
      id,
      name: `Usage ${index}`,
      isActive: true,
      forDelete: false,
      forAdd: true,
    }
    return newItem;
  }

  const onClickForDeleteItem = (item: UsageType) => {
    if (item.forAdd) {
      USAGE_TYPES.splice(USAGE_TYPES.indexOf(item), 1);
      setUsageTypes([...USAGE_TYPES]);
      return;
    }
    item.forDelete = !item.forDelete;
    setUsageTypes([...USAGE_TYPES]);
  }

  const onClickAddItem = () => {
    const usageTypes = [...USAGE_TYPES];
    const newItem = generateNewItem(USAGE_TYPES.length + 1);
    usageTypes.push(newItem);
    setUsageTypes(usageTypes);
  }

  useEffect(() => {
    onClickResetForm({} as any);
  }, []);

  return (<>
    <div className={`${ADMIN_SECTION}`}>
      <div className={`flex items-center ${ADMIN_HEADER}`}>
        <div className="pr-5">Usage Types</div>
        <button className={`${ADMIN_ACTION_BUTTONS}`} onClick={onClickAddItem}>+1</button>
      </div>
      <div className={`${ADMIN_CONTENT}`}>
        {USAGE_TYPES.map((usageType: UsageType, index: number) => (
          <div className={`${usageType.isActive? '!border-pink-500':'!border-gray-500 border-dashed opacity-50'} ${ITEM}`} key={usageType.id}>
            <div className={`${ROW}`}>
              {(usageType.id !== DefaultUsageTypeData.id) && (
                <div
                  className={`mr-2 ${!!usageType.forDelete && 'text-red-500 hover:text-red-800'} ${!!usageType.forAdd && 'text-green-500 hover:text-green-800'} ${actionIconStyles}`}
                  onClick={(event) => {onClickForDeleteItem(usageType)}}>
                  <TrashIcon></TrashIcon>
                </div>
              )}
              <div className={`whitespace-nowrap ${!!usageType.forDelete && 'text-red-500'} ${!!usageType.forAdd && 'text-green-500'}`}>
                {usageType.id === DefaultUsageTypeData.id && (
                  "DEFAULT"
                )}
                {usageType.id !== DefaultUsageTypeData.id && (
                  <span>{index+1}</span>
                )}
                <input
                  className={`${formInputStyles} w-[250px] text-sm ${INPUT_FIELD} ${!!usageType.forDelete && 'text-red-500'} ${!!usageType.forAdd && 'text-green-500'} ${formFieldStyles}`}
                  placeholder="Name..."
                  maxLength={55}
                  onChange={(event) => {
                    usageType.name = event.target.value;
                    setUsageTypes([...USAGE_TYPES]);
                  }}
                  value={usageType.name}
                />
              </div>
            </div>
            {(usageType.id !== DefaultUsageTypeData.id) && (
              <div className={`${ROW} mt-1`}>
                <div className={`${formLabelLeftStyles} ${usageType.isActive? '!text-blue-500':''}`}>
                  ENABLED:
                </div>
                <input
                  type="checkbox"
                  className={`ml-2 size-4`}
                  checked={usageType.isActive}
                  onChange={(event) => {
                    usageType.isActive = !usageType.isActive;
                    setUsageTypes([...USAGE_TYPES]);
                  }}
                />
              </div>
            )}
            <div className={`${ROW}`}>
              <div className="text-gray-400 mr-2">
                Usage Rate:
              </div>
              <input
                  value={usageType.usageRate}
                  maxLength={6}
                  className={`${formInputStylesSmall}`}
                  placeholder="Rate..."
                  onChange={(event) => {
                    usageType.usageRate = event.target.value.trim();
                    setUsageTypes([...USAGE_TYPES]);
                  }}
                />
            </div>
            {!usageType.useIcon && (
              <div className={`${ROW}`}>
                <div className="text-gray-400 mr-2">
                  Text Color:
                </div>
                <input
                  value={usageType.textColor}
                  maxLength={6}
                  className={`${formInputStylesSmall}`}
                  placeholder="Pick Color..."
                  onChange={(event) => {
                    usageType.textColor = event.target.value.trim();
                    setUsageTypes([...USAGE_TYPES]);
                  }}
                />
              </div>
            )}
            <div className={`${ROW} mt-1`}>
              <div className={`${formLabelLeftStyles} ${usageType.useIcon? '!text-blue-500':''}`}>
                Use Icon:
              </div>
              <input
                type="checkbox"
                className={`ml-2 size-4`}
                checked={usageType.useIcon}
                onChange={(event) => {
                  usageType.useIcon = !usageType.useIcon;
                  setUsageTypes([...USAGE_TYPES]);
                }}
              />
            </div>
            {usageType.useIcon && (
              <div className={`${ROW}`}>
                <div className="text-gray-400 mr-2">
                  Icon:
                </div>
                <input
                  value={usageType.icon}
                  maxLength={6}
                  className={`${formInputStylesSmall}`}
                  placeholder="Pick Icon..."
                  onChange={(event) => {
                    usageType.icon = event.target.value.trim();
                    setUsageTypes([...USAGE_TYPES]);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={`!text-right ${ADMIN_ACTIONS}`}>
        <button className={`${actionButtonStyles}`} onClick={onClickResetForm}>Reset</button>
        <button className={`${actionButtonStyles}`} onClick={() => {setShowConfirmSave(true)} }>Save</button>
      </div>
    </div>
    <ModalConfirm
      show={SHOW_CONFIRM_SAVE}
      dialogTitle={`SAVE USAGE TYPES`}
      dialogMessageFn={() => (
        <span className="text-base">
          <div className="mt-3 text-xl text-gray-200">Are you sure?</div>
        </span>
      )}
      onConfirm={() => {onClickSave()}}
      onCancel={() => {setShowConfirmSave(false)}}
    />
  </>)
}
