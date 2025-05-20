import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { TrashIcon } from "@heroicons/react/24/outline"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import ColorPicker, { Color } from '@rc-component/color-picker'
import { appStateAtom } from "~/appStateGlobal/atoms"
import { AppStorage } from "~/util/AppStorage"
import { DefaultUsageTypeData, type UsageType } from "~/config/AppState"
import ModalConfirm from "../../ui-components/modal/modalConfirm"

import '@rc-component/color-picker/assets/index.css'

import {
  ADMIN_ACTION_BUTTONS,
  ADMIN_ACTIONS,
  ADMIN_CONTENT,
  ADMIN_HEADER,
  ADMIN_SECTION
} from "./admin"
import {
  actionButtonStyles,
  actionIconStyles,
  formFieldStyles,
  formInputStyles,
  formInputStylesSmall,
  formLabelLeftStyles,
  INPUT_FIELD,
  ITEM,
  ROW
} from "~/util/GlobalStylesUtil"


export default function AdminUsageTypes() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [USAGE_TYPES, setUsageTypes] = useState([] as UsageType[]);
  const [SHOW_CONFIRM_SAVE, setShowConfirmSave] = useState(false);
  const [TEXT_COLOR, setTextColor] = useState(new Color('#ff0000'));

  const onClickResetForm = (event: any) => {
    const types = APP_STATE.usageTypes.map((type: UsageType ) => ({...type}));
    setUsageTypes(types);
  }

  const onClickSave = async () => {
    const types = USAGE_TYPES
      .map((type: UsageType) => {
        const value = {...type, forAdd: false, showIconPicker: false, showColorPicker: false};
        if (type.useIcon) {
          value.textColor = '';
        } else {
          value.icon = '';
        }
        return value;
      })
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
          <div className={`!min-w-[380px] ${usageType.isActive? '!border-pink-500':'!border-gray-500 border-dashed opacity-50'} ${ITEM}`} key={usageType.id}>
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
                  className={`
                    ${formInputStyles}
                    ${INPUT_FIELD}
                    w-[250px] text-sm
                    ${formFieldStyles}
                  `}
                  style={(!usageType.useIcon && !!usageType.textColor) ? {color: usageType.textColor} : {}}
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
                <div className={`${formLabelLeftStyles} ${usageType.isActive? '!text-pink-500':''}`}>
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
            <div className={`${ROW} mt-1`}>
              <div className={`${formLabelLeftStyles}`}>
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
            {usageType.useIcon && (<>
              <div className={`${ROW}`}>
                <div className="text-gray-400 mr-2">
                  Icon:
                </div>
                <input
                  readOnly={true}
                  value={usageType.icon}
                  maxLength={1}
                  className={`${formInputStylesSmall}`}
                  placeholder=""
                  onChange={(event) => {
                    usageType.icon = event.target.value.trim();
                    setUsageTypes([...USAGE_TYPES]);
                  }}
                  onClick={() => {
                    usageType.showIconPicker = !usageType.showIconPicker;
                    setUsageTypes([...USAGE_TYPES]);
                  }}
                />
                <div className={`ml-2 text-gray-400 hover:underline hover:cursor-pointer`}
                  onClick={() => {
                    usageType.icon = "";
                    usageType.showIconPicker = false;
                    setUsageTypes([...USAGE_TYPES]);
                  }}>
                    <span>Clear</span>
                </div>
              </div>
              {usageType.showIconPicker && (<>
                <div className={`ROW mt-2`}>
                  <Picker data={data}
                    onEmojiSelect={(emojiData) => {
                    usageType.icon = emojiData.native;
                    usageType.showIconPicker = false;
                    setUsageTypes([...USAGE_TYPES]);
                  }}></Picker>
                </div>
              </>)}
            </>)}
            {!usageType.useIcon && (<>
              <div className={`${ROW}`}>
                <div className="text-gray-400 mr-2">
                  Text Color:
                </div>
                <input
                  readOnly={true}
                  value={usageType.textColor}
                  maxLength={7}
                  className={`${formInputStylesSmall} uppercase`}
                  placeholder=""
                  onChange={(event) => {
                    usageType.textColor = event.target.value.trim();
                    setUsageTypes([...USAGE_TYPES]);
                  }}
                  onClick={() => {
                    usageType.showColorPicker = !usageType.showColorPicker;
                    setTextColor(new Color(usageType.textColor || TEXT_COLOR));
                    setUsageTypes([...USAGE_TYPES]);
                  }}
                />
                <div className={`ml-2 text-gray-400 hover:underline hover:cursor-pointer`}
                  onClick={() => {
                    usageType.textColor = "";
                    usageType.showColorPicker = false;
                    setUsageTypes([...USAGE_TYPES]);
                  }}>
                    <span>Clear</span>
                </div>
              </div>
              {usageType.showColorPicker && (<>
                <div className={`ROW mt-2`}>
                  <ColorPicker value={TEXT_COLOR}
                    disabledAlpha={true}
                    onChange={
                      (color: Color) => {
                        setTextColor(color);
                        usageType.textColor = color.toHexString();
                        setUsageTypes([...USAGE_TYPES]);
                      }
                    }></ColorPicker>
                </div>
              </>)}
            </>)}
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
