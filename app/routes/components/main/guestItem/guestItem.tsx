import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { appStateAtom, mainTakoverAtom, selectedListFilterAtom } from "~/appStateGlobal/atoms";
import { actionButtonStyles } from "~/util/GlobalStylesUtil";
import styles from "./guestItemStyles.module.css"
import { type Guest } from "~/config/AppState"
import GuestForm from '../guestForm/guestForm';
import { ArrowsPointingInIcon } from '@heroicons/react/24/outline';
import { Helpers, InitialTimeElapsed, type TimeElapsed } from '~/util/Helpers';
import { fragmentElapsedTime, fragmentExtraPlayersString } from '../../fragments/fragments';
import { AppStorage } from '~/util/AppStorage';

dayjs.extend(duration);
dayjs.extend(relativeTime);

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
  const itemCardStyles = `bg-transparent mt-2 p-2 hover:cursor-pointer select-none ${props.isAssigned?'':'border'} border-blue-800 rounded-xl`;
  const fieldLabel=`text-gray-500`;

  const [APP_STATE] = useAtom(appStateAtom);
  const [, setMainTakeover] = useAtom(mainTakoverAtom);
  const [SELECTED_LIST_FILTER] = useAtom(selectedListFilterAtom);
  const [TIME_ELAPSED, setTimeElapsed] = useState(InitialTimeElapsed);
  const [ITEM_EDIT, setEditItem] = useState(false);

  const guest = props.guest;

  const itemClicked = (event: React.MouseEvent<HTMLDivElement>) => {
    // table list
    if (props.isAssigned && props.itemExpanded) {
      event.stopPropagation();
      return;
    }

    // guest list
    if (!props.isAssigned && !props.itemExpanded) {
      props.setItemExpanded(prev => true);
    }
  }

  const onClickTableCloseout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const table = APP_STATE.tables.find(_ => _.guest?.id === props.guest.id);
    table.guest.closedOutAt = Date.now();
    await AppStorage.saveGuestRemote(table.guest);
    setMainTakeover({closeoutTable: table});
  }

  const onClickEditItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    props.setEditForm ? props.setEditForm(prev => true) : setEditItem(prev => true);
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
    return <>
      <div className="flex relative">
        {!props.isAssigned && props.itemExpanded && !SELECTED_LIST_FILTER && <>
          <div className="flex-1 text-right mb-2 text-gray-500" onClick={onClickCloseExpanded}>
            <ArrowsPointingInIcon aria-hidden="true" className="inline-block text-right mr-1 size-7 hover:stroke-white" />
          </div>
        </>}
      </div>
      {itemCollapsedRowContent()}
    </>
  }

  const itemDetailBodyContent = () => {
    return !(ITEM_EDIT || props.isEditForm) && (
      <div className="text-sm motion-preset-bounce">
        <div className="flex">
          <div className={`${!props.isAssigned && 'ml-7'} COLUMN text-left flex-1 text-gray-300 my-3`}>
            { guest.phoneNumber && (
              <div className="ROW"><span className={`${fieldLabel}`}>Phone: &nbsp;</span> {guest.phoneNumber} </div>
            )}
            {guest.partySize > 1 && (
              <div className="ROW">
                <span className={`${fieldLabel}`}>+{guest.partySize-1} more </span>
                {fragmentExtraPlayersString(guest.extraPlayers)}
              </div>
            )}
            <div className="ROW">
              <span className={`${fieldLabel}`}>Type: &nbsp; </span>
              {guest.tableType}
            </div>
            { guest.notes && (
              <div className="ROW">
                <span className={`${fieldLabel}`}>Notes: &nbsp;</span>
                {guest.notes}
              </div>
            )}
          </div>
        </div>
        <div className="flex">
          <div className="COLUMN flex-1 p-1 pb-2 min-w-7 text-right mr-2">
            <button className={`${actionButtonStyles}`} onClick={onClickEditItem}>Edit </button>
            <button className={`${actionButtonStyles}`} onClick={() => {onClickAssignItem(guest)}}>
              {props.isAssigned && 'Move'}
              {!props.isAssigned && 'Assign'}
            </button>
            {props.isAssigned && (
              <button className={`${actionButtonStyles}`} onClick={onClickTableCloseout}>Close Out </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const itemDetailGuestEditForm = () => {
    return (
      (ITEM_EDIT || props.isEditForm) && (
        <div className={`${!props.isAssigned && 'mx-5'}`}>
          <GuestForm guest={props.guest} onEditCloseCallback={onClickCancelEdit}></GuestForm>
        </div>
      )
    )
  }

  const itemCollapsedRowContent = () => {
    return (
      <div className="flex text-sm">
        {!props.isAssigned && (
          <div className="flex-grow-0 text-left min-w-7">
            <span className="text-gray-600">{props.index + 1}. </span>
          </div>
        )}
        <div className={`${styles.itemCardName} ${props.isAssigned && 'text-green-600'} flex-grow uppercase text-left text-blue-500 truncate`}>
          {guest.name}
          {!props.isAssigned && !props.itemExpanded && (guest.partySize > 1) && (
            <span className="text-gray-400 normal-case whitespace-nowrap">&nbsp; &nbsp; +{guest.partySize -1 } more</span>
          )}
        </div>
        {renderItemDuration()}
      </div>
    )
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
