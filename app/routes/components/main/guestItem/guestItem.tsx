import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { appStateAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles, optionStyles } from "~/util/GlobalStylesUtil";
import styles from "./guestItemStyles.module.css"
import type { TableItemData, Guest } from "~/config/AppState"
import ModalConfirm from "../../ui-components/modal/modalConfirm";
import GuestForm from '../guestForm/guestForm';
import { formFieldStyles } from '~/util/GlobalStylesUtil';
import { ArrowRightIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';
import { Helpers } from '~/util/Helpers';

dayjs.extend(duration);
dayjs.extend(relativeTime);

/**
 * A GuestItem on the GuestList moves to a TableItem on the TableList.
 * GuestItem depends on parent container to satisfy the state interface
 *   - GuestList -> GuestListItem (IS a wrapped Guest) -> GuestItem
 *   - TableList -> TableListItem (HAS an associated Guest) -> GuestItem
 */
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
  const durationSquareStyles = `flex flex-grow-0 px-2 items-center justify-end text-md`;
  const itemCardStyles = `bg-transparent mt-2 p-2 hover:cursor-pointer select-none ${props.isAssigned?'':'border'} border-blue-800 rounded-xl`;

  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [TIME_ELAPSED, setTimeElapsed] = useState({minutes: 0, hours: 0, days: 0});
  const [ITEM_EDIT, setEditItem] = useState(false);
  const [SHOW_CONFIRM_DELETE, setShowConfirmDelete] = useState(false);
  const [SELECTED_TABLE, setSelectedTable] = useAtom(selectedTableAtom);

  const guest = props.guest;
  const tableAssignmentRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = Date.now();
      const timestamp = props.isAssigned ? props.guest.assignedAt : guest.createdAt;;
      const totalMinutes = Math.floor((now - timestamp) / (1000 * 60));
      const quarterHours = totalMinutes / 15;
      const duration = dayjs.duration({ minutes: totalMinutes });
      const hours = Math.floor(duration.asHours());
      const days = Math.floor(duration.asDays());
      const minutes = totalMinutes % 60;
      setTimeElapsed({minutes, hours, days});
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000 * 30);

    return () => clearInterval(intervalId); // Cleanup on unmount/re-render
  }, []);

  useEffect(() => {
    props.setItemEditing && props.setItemEditing(ITEM_EDIT);
  }, [ITEM_EDIT]);


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

  const deleteItemClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowConfirmDelete(prev => true);
  }

  const checkoutItemClicked = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    // TODO: show checkout form...
    // but for now, delete...
    const appState = await AppStorage.deleteGuestRemote(props.guest.id);
    setAppState(appState);
    props.setItemExpanded(prev => false);
    setSelectedTable(undefined);
  }

  const editItemClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    props.setEditForm ? props.setEditForm(prev => true) : setEditItem(prev => true);
  }

  const cancelEditClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    props.setEditForm ? props.setEditForm(prev => false) : setEditItem(prev => false);
  }

  const assignGuestClicked = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const tableId = tableAssignmentRef.current && Number(tableAssignmentRef.current.value);
    if (!tableId) return;
    const guestId = props.guest.id;

    const newState = await AppStorage.assignToTableRemote({tableId, guestId});
    setAppState(newState);
    if (props.isAssigned) {
      props.setItemExpanded(prev => !props.itemExpanded);
    }
    setSelectedTable(undefined);
  }

  const unassignGuestClicked = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSelectedTable(undefined);
  }

  const onConfirmDelete = async () => {
    const appState = await AppStorage.deleteGuestRemote(props.guest.id);
    setAppState(appState);
    setShowConfirmDelete(prev => false);
    props.setItemExpanded(prev => false);
  }

  const onCancelDelete = () => {
    setShowConfirmDelete(prev => false);
  }

  const onCloseExpandedClicked = (event: React.MouseEvent<HTMLDivElement>) => {
    props.setItemExpanded(prev => false);
    setEditItem(prev => false);
  }

  const itemDurationContent = () => {
    const timeElapsedMinutes = TIME_ELAPSED.minutes >= 0 ? TIME_ELAPSED.minutes : 0;
    return <>
    <div className={`${styles.itemDurationContainer}`}>
      { TIME_ELAPSED.hours < 1 && ( // Less than 1 hour
        <div className={`${durationSquareStyles} text-gray-300`}>
          {timeElapsedMinutes}m
        </div>
      )}
      { TIME_ELAPSED.hours >= 1 && TIME_ELAPSED.days < 1 && ( // Less than 1 day
        <div className={`${durationSquareStyles} text-red-800`}>
          {TIME_ELAPSED.hours}h
        </div>
      )}
      { TIME_ELAPSED.days >= 1 &&  ( // More than a day
        <div className={`${durationSquareStyles} text-gray-600`}>
          {TIME_ELAPSED.days}d
        </div>
      )}
    </div>
    </>
  }

  const assignTableContent = () => {
    return Helpers.tablesAvailable(APP_STATE).length > 0 && <>
    <div className="flex">
      <div className="COLUMN text-left flex-1 text-gray-400 ml-7 mr-3 mt-5 my-3 text-md">
        <div className="ml-1 text-sm"> Assign to table:</div>
        <select ref={tableAssignmentRef} className={`uppercase ${formFieldStyles}`}>
        {
          Helpers.tablesAvailable(APP_STATE)
            .sort((A: TableItemData, B: TableItemData) => A.number - B.number)
            .map((table: TableItemData) =>
              <option className={optionStyles} key={table.id} value={table.id}>{table.nickname || table.name}  &nbsp;-&nbsp;  {table.type}</option>
            )
        }
        </select>
      </div>
    </div>
    <div className="flex">
      <div className="COLUMN flex-1 p-1 pb-2 min-w-7 text-right mr-2">
        <button className={`${actionButtonStyles}`} onClick={assignGuestClicked}>
          <ArrowRightIcon aria-hidden="true" className="mr-2 size-5" />
          Assign
        </button>
      </div>
    </div>
  </>
  }

  const itemDetailHeaderContent = () => {
    return <>
      <div className="flex relative">
        {!props.isAssigned && props.itemExpanded && <>
          <div className="flex-1 text-right mb-2 text-gray-500" onClick={onCloseExpandedClicked}>
            <ArrowsPointingInIcon aria-hidden="true" className="inline-block text-right mr-1 size-7 hover:stroke-white" />
          </div>
        </>}
      </div>
      {itemCollapsedRowContent()}
    </>
  }

  const itemDetailBodyContent = () => {
    return !(ITEM_EDIT || props.isEditForm) && ( // Expanded State: item Detail
      <div className="">
        <div className="flex">
          <div className="COLUMN text-left flex-1 text-gray-400 ml-7 my-3">
            { guest.phoneNumber && (
              <div className="ROW mb-2">{guest.phoneNumber} </div>
            )}
            {guest.partySize > 1 && (
              <div className="ROW">{guest.partySize - 1} Extra Players
                {guest.extraPlayersString && (
                  <div className="ml-5 mb-2 text-purple-400 text-sm uppercase">{guest.extraPlayersString}</div>
                )}
              </div>
            )}
            <div className="ROW">{guest.tableType}</div>
            { guest.notes && (
              <div className="ROW mt-2">
                Notes
                <div className="italic ml-5 text-sm text-purple-400">{guest.notes} </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex">
          <div className="COLUMN flex-1 p-1 pb-2 min-w-7 text-right mr-2">
            {/* {props.isAssigned && (
              <button className={`${actionButtonStyles}`} onClick={unassignGuestClicked}>
                Unassign
              </button>
            )} */}
            <button className={`${actionButtonStyles}`} onClick={editItemClicked}>Edit </button>
            {props.isAssigned && (
              <button className={`${actionButtonStyles}`} onClick={checkoutItemClicked}>Check Out </button>
            )}
            {!props.isAssigned && (
              <button className={`${actionButtonStyles}`} onClick={deleteItemClicked}>Delete </button>
            )}
          </div>
        </div>
        {assignTableContent()}
      </div>
    )
  }

  const itemDetailGuestEditForm = () => {
    return (
      (ITEM_EDIT || props.isEditForm) && ( // Expanded: Item Edit
        <div className="mx-5">
          <GuestForm guest={props.guest} onEditCloseCallback={cancelEditClicked}></GuestForm>
        </div>
      )
    )
  }

  const itemCollapsedRowContent = () => {
    return ( // Collapsed: Item row
      <div className="flex text-lg">
        <div className="flex-grow-0 text-left min-w-7">
          {!props.isAssigned && (
            <span className="text-gray-600">{props.index + 1}. </span>
          )}
        </div>
        <div className={`${styles.itemCardName} flex-grow uppercase text-left text-gray-300 truncate`}>
          {guest.name}
        </div>
        <div className={`${guest.partySize > 1 ? 'text-gray-300' : 'text-transparent'} flex-1 my-auto pr-2`}>
          <span className={`inline-block text-nowrap ${guest.partySize > 1 && 'text-gray-600'}`}>Party of {guest.partySize}</span>
        </div>
        {itemDurationContent()}
      </div>
    )
  }

  return (
    <div className={`${styles.itemCard} ${itemCardStyles}`} onClick={itemClicked}>
      { props.itemExpanded && ( // Expanded State
        <div className={`text-left text-lg rounded-lg motion-preset-expand`}>
          {itemDetailHeaderContent()}
          {itemDetailBodyContent()}
          {itemDetailGuestEditForm()}
        </div>
      )}
      {!props.itemExpanded && itemCollapsedRowContent()}
      <ModalConfirm
        show={SHOW_CONFIRM_DELETE}
        dialogTitle={`CONFIRM DELETE`}
        dialogMessageFn={() => <span className="text-lg">
          Delete <span className="text-red-500 font-bold">{guest.name.toUpperCase()}</span> from Wait List?
        </span>}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </div>
  )
}