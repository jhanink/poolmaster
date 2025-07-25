import '@rc-component/color-picker/assets/index.css'

import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { TrashIcon } from "@heroicons/react/24/outline"
import data from '@emoji-mart/data'
import EmojiPicker from '@emoji-mart/react'
import ColorPicker, { Color } from '@rc-component/color-picker'
import { appStateAtom } from "~/appStateGlobal/atoms"
import { AppStorage } from "~/util/AppStorage"
import { DEFAULT_ID, DefaultUsageTypeData, type UsageType } from "~/config/AppState"
import ModalConfirm from "../../ui-components/modal/modalConfirm"
import { Helpers } from "~/util/Helpers"

import {
  ADMIN_ACTION_BUTTONS,
  ADMIN_ACTIONS,
  ADMIN_CONTENT,
  ADMIN_HEADER,
  ADMIN_HEADER_STICKY,
  ADMIN_HEADER_STICKY_SPACER_TOP,
  ADMIN_SECTION
} from "./admin"
import {
  actionButtonStyles,
  actionIconStyles,
  formFieldStyles,
  formInputStyles,
  formInputStylesSmall,
  formLabelLeftStyles,
  formSelectStyles,
  optionStyles,
  INPUT_FIELD,
  ITEM,
  ROW,
  ADMIN_SECTION_SCROLL_MARGIN_TOP,
  INPUT_FIELD_LG,
  INPUT_FIELD_MED,
} from "~/util/GlobalStylesUtil"
import { fragmentUsageIndicator } from '../../fragments/fragments'

const borderColor = 'border rounded-lg !border-pink-400';
const bgColor = 'bg-pink-400';

export default function AdminUsageTypes(props: {
  ref: React.RefObject<HTMLDivElement>;
}) {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [USAGE_TYPES, setUsageTypes] = useState([] as UsageType[]);
  const [SHOW_CONFIRM_SAVE, setShowConfirmSave] = useState(false);
  const [TEXT_COLOR, setTextColor] = useState(new Color('#ff0000'));

  const onClickResetForm = () => {
    const types = APP_STATE.usageTypes.map((type: UsageType ) => ({...type}));
    setUsageTypes(types);
    props.ref.current.scrollIntoView(true);
  }

  const onClickSaveItem = async () => {
    const types = USAGE_TYPES
      .map((type: UsageType) => {
        const value = {...type, forAdd: false, showIconPicker: false, showColorPicker: false};
        if (!type.useIcon) {
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
    props.ref.current.scrollIntoView(true);
  }

  const generateNewItem = (index: number = 1): UsageType => {
    const id = Date.now() + index;
    const newItem: UsageType = {
      ...DefaultUsageTypeData,
      id,
      name: `Usage ${index}`,
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
    onClickResetForm();
  }, []);

  return (<>
    <div className={`${ADMIN_SECTION}`} style={ADMIN_SECTION_SCROLL_MARGIN_TOP} ref={props.ref}>
      <div className={`${ADMIN_HEADER_STICKY}`}>
        <div className={`${ADMIN_HEADER_STICKY_SPACER_TOP}`}>
          <div className={`${borderColor}`}>
            <div className={`${ADMIN_HEADER} ${bgColor}`}>
              <div className={`flex items-center`}>
                <div className="pr-2">Usage Types</div>
                <button className={`${ADMIN_ACTION_BUTTONS}`} onClick={onClickAddItem}>+1</button>
              </div>
              <div className="italic text-sm">Usage name, rate, indicators</div>
            </div>
            <div className={`${ADMIN_ACTIONS}`}>
              <button className={`${actionButtonStyles}`} onClick={onClickResetForm}>Reset</button>
              <button className={`${actionButtonStyles}`} onClick={() => {setShowConfirmSave(true)} }>Save</button>
            </div>
          </div>
        </div>
      </div>
      <div className={`${ADMIN_CONTENT}`}>
        {USAGE_TYPES.map((usageType: UsageType, index: number) => (
          <div className={`!px-2 ${usageType.isActive? `${borderColor}`:'!border-gray-500 border-dashed opacity-50'} ${ITEM}`} key={usageType.id}>
            <div className={`${ROW}`}>
              {(usageType.id !== DEFAULT_ID) && (
                <div
                  className={`${!!usageType.forDelete && 'text-rose-500 hover:text-red-800'} ${!!usageType.forAdd && 'text-green-500 hover:text-green-800'} ${actionIconStyles}`}
                  onClick={(event) => {onClickForDeleteItem(usageType)}}>
                  <TrashIcon></TrashIcon>
                </div>
              )}
              {usageType.id === DEFAULT_ID && (
                <span>
                  DEFAULT
                </span>
              )}
              {usageType.id !== DEFAULT_ID && (
                <span className="ml-2">{index+1}</span>
              )}
              <div className={`text-nowrap ${!!usageType.forDelete && 'text-rose-500'} ${!!usageType.forAdd && 'text-green-500'}`}>
                <input
                  disabled={usageType.id === DEFAULT_ID}
                  className={`
                    ${usageType.id === DEFAULT_ID ? INPUT_FIELD_MED : INPUT_FIELD_LG}
                    ${usageType.id === DEFAULT_ID ? 'select-none text-gray-500' : ''}
                    ${formInputStyles}
                    ${INPUT_FIELD}
                    ${formFieldStyles}
                  `}
                  style={(!!usageType.textColor) ? {color: usageType.textColor} : {}}
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
            {(usageType.id !== DEFAULT_ID) && (<>
              <div className={`${ROW} mt-1`}>
                <div className={`w-[90px] ${formLabelLeftStyles} ${usageType.isActive? '!text-pink-500':''}`}>
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
              <div className={`${ROW}`}>
                <div className="text-gray-400 mr-2">
                  Rate:
                </div>
                <select
                  onChange={(event) => {
                    usageType.tableRateId = Number(event.target.value);
                    setUsageTypes([...USAGE_TYPES]);
                  }}
                  value={usageType.tableRateId}
                  className={`grow ${formSelectStyles}`}
                >
                  {APP_STATE.tableRates
                    .filter((tableRate) => tableRate.isActive)
                    .map((tableRate) => (
                      <option key={tableRate.id} className={optionStyles} value={tableRate.id}>{tableRate.name} {Helpers.tableRateSuffix(tableRate)}</option>
                    ))
                  }
                </select>
              </div>
              <div className={`${ROW} mt-1`}>
                <div className={`w-[90px] ${formLabelLeftStyles} ${usageType.useIcon? '!text-cyan-500':''}`}>
                  USE ICON:
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
                  <div className={`ROW flex justify-center mt-2`}>
                    <EmojiPicker data={data}
                      onEmojiSelect={(emojiData) => {
                      usageType.icon = emojiData.native;
                      usageType.showIconPicker = false;
                      setUsageTypes([...USAGE_TYPES]);
                    }}></EmojiPicker>
                  </div>
                </>)}
              </>)}
              {usageType.useIcon && (<>
                <div className={`${ROW} mt-1`}>
                  <div className={`w-[90px] ${formLabelLeftStyles} ${usageType.useIcon? '!text-cyan-500':''}`}>
                    ICON ONLY:
                  </div>
                  <input
                    type="checkbox"
                    className={`ml-2 size-4`}
                    checked={usageType.iconOnly}
                    onChange={(event) => {
                      usageType.iconOnly = !usageType.iconOnly;
                      setUsageTypes([...USAGE_TYPES]);
                    }}
                  />
                </div>
              </>)}
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
              <div className="flex justify-start mt-2">
                {fragmentUsageIndicator(usageType)}
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
    </div>
    <ModalConfirm
      show={SHOW_CONFIRM_SAVE}
      dialogTitle={`SAVE USAGE TYPES`}
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
