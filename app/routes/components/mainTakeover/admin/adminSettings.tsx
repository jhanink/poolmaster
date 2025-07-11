import { actionButtonStyles, ADMIN_SECTION_SCROLL_MARGIN_TOP, formSelectStyles, ITEM, largePartyStylesOptions, optionStyles, ROW, tableChipsStyle } from "~/util/GlobalStylesUtil";
import { ADMIN_ACTIONS, ADMIN_CONTENT, ADMIN_HEADER, ADMIN_HEADER_STICKY, ADMIN_HEADER_STICKY_SPACER_TOP, ADMIN_SECTION } from "./admin";
import { DefaultGuestData, DefaultSettings, LARGE_PARTY_SIZE_ARRAY, type Guest} from "~/config/AppState";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { appStateAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";
import ModalConfirm from "../../ui-components/modal/modalConfirm";
import { fragmentGuestName } from "../../fragments/fragments";

const partySizeArray = [...LARGE_PARTY_SIZE_ARRAY];
const borderColor = 'border rounded-lg !border-teal-500';
const bgColor = 'bg-teal-500';
const chipTable = ['Table 1', 'Table 2', 'Table 5', 'Table 16'];
const chipContent = ['Regulation', 'Pro', 'Sam', 'Jen : 4'];

export default function AdminSettings(props: {
  ref: React.RefObject<HTMLDivElement>;
}) {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [SETTINGS, setSettings] = useState(DefaultSettings);
  const [SHOW_CONFIRM_SAVE, setShowConfirmSave] = useState(false);

  const onClickResetForm = () => {
    setSettings({...APP_STATE.adminSettings});
    props.ref.current.scrollIntoView(true);
  }

  const onClickSaveItem = () => {
    const newState = {
      ...APP_STATE,
      adminSettings: SETTINGS,
    }
    AppStorage.setAppStateRemote(newState);
    setAppState(newState);
    setShowConfirmSave(false);
    props.ref.current.scrollIntoView(true);
  }

  const tableChip = (index: number) => {
    return (
      <button className={`CHIP hover: ${tableChipsStyle} gap-2 uppercase !m-0 hover:cursor-pointer`}>
        {chipTable[index]}
        {SETTINGS.showTableChipInfo && (
          <div className={`uppercase italic text-[10px] text-gray-500 !font-normal`}>
            {chipContent[index]}
          </div>
        )}
      </button>
    )
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
                <div>Settings</div>
                <div className="italic text-sm">App settings</div>
            </div>
            <div className={`${ADMIN_ACTIONS}`}>
              <button className={`${actionButtonStyles}`} onClick={onClickResetForm}>Reset</button>
              <button className={`${actionButtonStyles}`} onClick={() => {setShowConfirmSave(true)} }>Save</button>
            </div>
          </div>
        </div>
      </div>
      <div className={`${ADMIN_CONTENT}`}>
        <div className={`${ITEM} ${borderColor}`}>
          <div className={`${ROW} text-gray-400 `}>
            Large Party Size & Color:
          </div>
          <div className="mt-1 border border-gray-700 mx-2 p-3 rounded-lg">
            <div className={`${ROW}`}>
              <select
                onChange={(event) => {
                  SETTINGS.largePartySize = Number(event.target.value);
                  setSettings({...SETTINGS});
                }}
                value={SETTINGS.largePartySize}
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
                  SETTINGS.largePartyStyle = Number(event.target.value);
                  setSettings({...SETTINGS});
                }}
                value={SETTINGS.largePartyStyle}
                className={`${formSelectStyles} pb-3`}
              >
                {largePartyStylesOptions.map((style) => (
                  <option key={style.id} className={optionStyles} value={style.id}>{style.name}</option>
                ))}
              </select>
            </div>
            <div className="mt-1">
              {fragmentGuestName(
                SETTINGS,
                {
                  ...DefaultGuestData,
                  name: 'Margaret',
                  partySize: SETTINGS.largePartySize
                } as Guest)
              }
            </div>
          </div>

          <div className={`${ROW} mt-5`}>
            <div className={`text-gray-400 `}>
              Show Table Chip Info:
            </div>
            <input
              type="checkbox"
              className={`ml-2 size-4`}
              checked={SETTINGS.showTableChipInfo}
              onChange={(event) => {
                SETTINGS.showTableChipInfo = !SETTINGS.showTableChipInfo;
                setSettings({...SETTINGS});
              }}
            />
          </div>
          <div className="mt-1 border border-gray-700 mx-2 p-3 rounded-lg">
            <div className="text-gray-500">
              Assign Tables:
            </div>
            <div className="mt-2 flex items-center justify-center gap-2">
              {tableChip(0)}
              {tableChip(1)}
            </div>
            <div className="mt-2 text-gray-500">
              Active Tables:
            </div>
            <div className="mt-2 flex items-center justify-center gap-2">
              {tableChip(2)}
              {tableChip(3)}
            </div>
          </div>
          <div className={`${ROW} mt-5`}>
            <div className={`text-gray-400 `}>
              Show Table List Cards:
            </div>
            <input
              type="checkbox"
              className={`ml-2 size-4`}
              checked={SETTINGS.showTableListCards}
              onChange={(event) => {
                SETTINGS.showTableListCards = !SETTINGS.showTableListCards;
                setSettings({...SETTINGS});
              }}
            />
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
