import { actionButtonStyles, ITEM, ROW } from "~/util/GlobalStylesUtil";
import { ADMIN_ACTIONS, ADMIN_CONTENT, ADMIN_HEADER, ADMIN_HEADER_STICKY, ADMIN_SECTION } from "./admin";
import { useAtom } from "jotai";
import { useState } from "react";
import { appStateAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";
import ModalConfirm from "../../ui-components/modal/modalConfirm";
import type { TableItem } from "~/config/AppState";
import { Helpers } from "~/util/Helpers";

const borderColor = '!border-gray-700';
const bgColor = 'bg-white';

enum ACTION_ENUM {
  CLEAR_GUEST_LIST = 'clear-guest-list',
  CLEAR_TABLE_LIST = 'clear-table-list',
}

type ADMIN_ACTIONS = ACTION_ENUM.CLEAR_GUEST_LIST | ACTION_ENUM.CLEAR_TABLE_LIST;

export default function AdminActions() {
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [SHOW_CONFIRM_SAVE, setShowConfirmSave] = useState(false);
  const [ACTION, setAction] = useState(undefined as ADMIN_ACTIONS);

  const onClickSaveItem = () => {

    const newState = {
      ...APP_STATE,
    }
    if (ACTION === ACTION_ENUM.CLEAR_GUEST_LIST) {
      newState.guestList = [];
    }
    if (ACTION === ACTION_ENUM.CLEAR_TABLE_LIST) {
      APP_STATE.tables.forEach((table: TableItem) => {
        table.guest = undefined;
      });
      newState.tables = [...APP_STATE.tables];
    }

    AppStorage.setAppStateRemote(newState);
    setAppState(newState);
    setAction(undefined);
    setShowConfirmSave(false);
  }

  const onClickAction = (action: ADMIN_ACTIONS) => {
    setAction(action)
    setShowConfirmSave(true);
  }

  const getDialogTitle = () => {
    if (ACTION === ACTION_ENUM.CLEAR_GUEST_LIST) {
      return 'CLEAR ALL GUESTS FROM WAITLIST';
    }
    if (ACTION === ACTION_ENUM.CLEAR_TABLE_LIST) {
      return 'CLEAR ALL TABLE ASSIGNMENTS';
    }
    return '';
  }

  return (<>
    <div className={`${ADMIN_SECTION}`}>
      <div className={`${ADMIN_HEADER_STICKY} ${borderColor}`}>
        <div className={`${ADMIN_HEADER} ${bgColor}`}>
          <div className={`flex items-center text-red`}>
            <div className="font-semibold">Admin Actions</div>
          </div>
        </div>
      </div>
      <div className={`${ADMIN_CONTENT} text-center text-gray-300`}>
        <div className={`${ITEM} ${ROW} ${borderColor} text-xl`}>
          <span className="w-[175px] text-left">
            <button className={`${actionButtonStyles}`} onClick={() => {onClickAction(ACTION_ENUM.CLEAR_GUEST_LIST)}}>
              Clear Waitlist
            </button>
          </span>
          {APP_STATE.guestList.length}
        </div>
        <div className={`${ITEM} ${ROW} ${borderColor} text-xl`}>
          <span className="w-[175px] text-left">
            <button className={`${actionButtonStyles}`} onClick={() => {onClickAction(ACTION_ENUM.CLEAR_TABLE_LIST)}}>
              Clear Table List
            </button>
          </span>
          {Helpers.tablesAssigned(APP_STATE).length}
        </div>
      </div>
    </div>
    <ModalConfirm
      show={SHOW_CONFIRM_SAVE}
      dialogTitle={getDialogTitle()}
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
