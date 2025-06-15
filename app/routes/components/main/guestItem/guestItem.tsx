import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { appStateAtom, isSavingAtom, mainTakoverAtom, selectedListFilterAtom } from "~/appStateGlobal/atoms";
import { actionButtonStyles, largePartyStylesOptions } from "~/util/GlobalStylesUtil";
import styles from "./guestItemStyles.module.css"
import { DEFAULT_ID, type Guest } from "~/config/AppState"
import GuestForm from '../guestForm/guestForm';
import { ArrowsPointingInIcon } from '@heroicons/react/24/outline';
import { Helpers, InitialTimeElapsed, type TimeElapsed } from '~/util/Helpers';
import { fragmentElapsedTime, fragmentUsageIndicator } from '../../fragments/fragments';
import { AppStorage } from '~/util/AppStorage';

export default function GuestItem(props: {
  guest: Guest,
  index: number,
  isAssigned: boolean,
  itemExpanded: boolean,
  setItemExpanded: React.Dispatch<React.SetStateAction<boolean>>,
  isEditForm?: boolean,
  setEditForm?: React.Dispatch<React.SetStateAction<boolean>>,
  setItemEditing?: React.Dispatch<React.SetStateAction<boolean>>,
}) {
  const itemCardStyles = `bg-transparent mt-2 p-1 hover:cursor-pointer select-none ${props.isEditForm && 'border'} ${props.isAssigned?'!border-green-800':'border'} border-blue-800 rounded-xl`;
  const fieldLabel = `inline-block text-gray-500 !w-[60px]`;
  const statusIndicatorStyles = `flex items-center space-x-2 ${props.itemExpanded ? '': 'mt-1'}`;

  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [, setMainTakeover] = useAtom(mainTakoverAtom);
  const [SELECTED_LIST_FILTER] = useAtom(selectedListFilterAtom);
  const [TIME_ELAPSED, setTimeElapsed] = useState(InitialTimeElapsed);
  const [ITEM_EDIT, setEditItem] = useState(false);
  const [SAVING, setSaving] = useAtom(isSavingAtom);

  const guest = props.guest;

  const itemClicked = (event: React.MouseEvent<HTMLDivElement>) => {
    if (props.isAssigned && props.itemExpanded) {  // table list
      event.stopPropagation();
      return;
    }

    if (!props.isAssigned && !props.itemExpanded) {  // guest list
      props.setItemExpanded(prev => true);
    }
  }

  const onClickTableCloseout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const table = APP_STATE.tables.find(_ => _.guest?.id === props.guest.id);
    table.guest.closedOutAt = Date.now();
    setSaving(true);
    const newAppState = await AppStorage.saveGuestRemote(table.guest);
    setAppState(newAppState);
    setMainTakeover({closeoutTable: table});
    setSaving(false);
  }

  const onClickEditItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    props.setEditForm ? props.setEditForm(prev => true) : setEditItem(prev => true);
    setMainTakeover({editGuest: guest});
  }

  const onClickAssignItem = (guest: Guest) => {
    setMainTakeover({assignTable: guest});
  }

  const onClickCancelEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event && event.stopPropagation();
    props.setEditForm ? props.setEditForm(prev => false) : setEditItem(prev => false);
  }

  const onClickCloseExpanded = (event: React.MouseEvent<HTMLDivElement>) => {
    props.setItemExpanded(prev => false);
    setEditItem(prev => false);
  }

  const renderItemDuration = () => {
    return (
      <div className={`${styles.itemDurationContainer}`}>
        {fragmentElapsedTime(TIME_ELAPSED, props.isAssigned)}
      </div>
    )
  }

  const itemDetailHeaderContent = () => {
    return (<>
      <div className="flex relative">
        {!props.isAssigned && props.itemExpanded && !SELECTED_LIST_FILTER && !props.isEditForm && <>
          <div className="flex-1 text-right mb-2 text-gray-500" onClick={onClickCloseExpanded}>
            <ArrowsPointingInIcon aria-hidden="true" className="inline-block text-right mr-1 size-7 hover:stroke-white" />
          </div>
        </>}
      </div>
      {itemCollapsedRowContent()}
    </>)
  }

  const itemDetailGuestInfo = (guest: Guest) => {
    const partySize = guest.partySize;
    if (partySize < 2 && !guest.phoneNumber && !guest.notes && props.isAssigned) return;
    return (<>
      <hr className="border-gray-900 mt-3 mx-1"/>
      <div className="text-gray-500 mt-1 mx-6 text-center uppercase">
        <span>Visit Information</span>
      </div>
      <div className="text-sm mx-3">
        <div className="">
          <div className={`COLUMN flex flex-col gap-1 text-left text-gray-300 my-3`}>
            {partySize > 1 && (
              <div className="ROW text-gray-300">
                <span className={`${fieldLabel}`}>Size:</span>
                Party of {partySize}
              </div>
            )}
            {!!guest.extraPlayers.length && (<>
              <div className="ROW text-gray-300">
                <span className={`${fieldLabel}`}>Names:</span>
                {guest.extraPlayers.reduce((all, next) => {
                  all.push(next.name);
                  return all;
                }, []).join(', ')}
              </div>
            </>)}
            { guest.phoneNumber && (
              <div className="ROW">
              <span className={`${fieldLabel}`}>Phone:</span>
              {guest.phoneNumber}
              </div>
            )}
            {!props.isAssigned && (
              <div className="ROW">
                <span className={`${fieldLabel}`}>
                  {guest.tableOrTableType ? (
                    `Table:`
                  ): (
                    `Type:`
                  )}
                </span>
                <span className="uppercase">
                  {Helpers.getTableOrTableType(APP_STATE, guest).name}
                </span>
              </div>
            )}
            {guest.notes && (
              <div className="ROW">
                <span className={`${fieldLabel}`}>Notes:</span>
                {guest.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    </>)
  }

  const itemDetailBodyContent = () => {
    if (ITEM_EDIT || props.isEditForm) return;
    return (<>
      {itemDetailGuestInfo(props.guest)}
      <hr className="border-gray-900 my-2 mx-1"/>
      <div>
        <div className="flex">
          <div className="COLUMN flex-1 p-1 text-right">
            <button className={`${actionButtonStyles} !text-xs`} onClick={onClickEditItem}>Edit </button>
            <button className={`${actionButtonStyles} !text-xs`} onClick={() => {onClickAssignItem(guest)}}>
              {props.isAssigned && 'Move'}
              {!props.isAssigned && 'Assign'}
            </button>
            {props.isAssigned && (
              <button
               disabled={SAVING}
               className={`${actionButtonStyles} !text-xs`} onClick={onClickTableCloseout}>Close Out </button>
            )}
          </div>
        </div>
      </div>
    </>)
  }

  const itemStatusBar = () => {
    const usageType = Helpers.getUsageType(APP_STATE, props.guest.usageTypeId);
    const isEdit = ITEM_EDIT || props.isEditForm;
    const showStatusBar = (usageType.id !== DEFAULT_ID);

    return !isEdit && (showStatusBar) &&  (<>
      <div className={`${statusIndicatorStyles} justify-center text${props.itemExpanded && 'border-t border-gray-900 pt-1'}`}
          onClick={(event) => {
            if (SELECTED_LIST_FILTER) return;
            props.setItemExpanded(prev => !prev);
            event.stopPropagation();
            event.preventDefault();
          }}
      >
        {fragmentUsageIndicator(usageType)}
      </div>
    </>)
  }

  const itemDetailGuestEditForm = () => {
    return (
      (ITEM_EDIT || props.isEditForm) && (
        <div>
          <GuestForm guest={props.guest} onEditCloseCallback={onClickCancelEdit}></GuestForm>
        </div>
      )
    )
  }

  const itemCollapsedRowContent = () => {
    const statusBar = APP_STATE.statusIndicators;
    const partySize = props.guest.partySize;
    const isLargeParty = partySize >= statusBar.largePartySize;
    const largePartyStyle = `!text-sm ${largePartyStylesOptions[statusBar.largePartyStyle - 1].style}`;

    return (<>
      <div className="flex text-sm">
        {!props.isAssigned && (
          <div className="flex-grow-0 text-left min-w-7">
            <span className="text-gray-600">{props.index + 1}. </span>
          </div>
        )}
        <div className={`${styles.itemCardName} ${props.isAssigned && 'text-green-600'} uppercase text-left text-blue-500 truncate`}>
          <div className={`inline-block italic ${isLargeParty ? `${largePartyStyle} !text-xs`: ``}`}>
            {guest.name}
            {guest.partySize > 1 && (<>
              <span className={`${isLargeParty?'':'text-gray-500'}`}> : {guest.partySize}</span>
            </>)}
          </div>
        </div>
        {renderItemDuration()}
      </div>
      {itemStatusBar()}
    </>)
  }

  useEffect(() => {
    const updateClock = () => {
      const start = props.isAssigned ? props.guest.assignedAt : guest.createdAt;
      const end = Date.now();
      const duration: TimeElapsed = Helpers.timeElapsed(start, end);
      setTimeElapsed(duration);
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000 * 30);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    props.setItemEditing && props.setItemEditing(ITEM_EDIT);
  }, [ITEM_EDIT]);

  return (
    <div className={`${styles.itemCard} ${itemCardStyles}`} onClick={itemClicked}>
      { props.itemExpanded && (
        <div className={`text-left text-sm rounded-lg`}>
          {itemDetailHeaderContent()}
          {itemDetailBodyContent()}
          {itemDetailGuestEditForm()}
        </div>
      )}
      {!props.itemExpanded && itemCollapsedRowContent()}
    </div>
  )
}
