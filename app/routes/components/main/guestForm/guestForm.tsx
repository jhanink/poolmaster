
import { useMask } from '@react-input/mask';
import React, { useEffect, useRef, useState } from "react";
import { DefaultGuestData, type Guest } from "~/config/AppState";
import { AppStorage } from "~/util/AppStorage";
import { useAtom } from "jotai";
import { appStateAtom, guestFormOpenAtom } from "~/appStateGlobal/atoms";
import styles from "./guestFormStyles.module.css";
import { formFieldStylesFullWidth } from "~/util/GlobalStylesUtil";
import { actionButtonStyles, optionStyles } from "~/util/GlobalStylesUtil";
import { useFetcher } from 'react-router';
import ModalConfirm from '../../ui-components/modal/modalConfirm';

const formColumnStyles = `COLUMN flex m-1`;
const fieldStyles = `flex-1`;
const labelStyles = `text-sm text-gray-400 ml-1 top-2 relative`;
const partySizeArray = Array.from({length: 20}, (_, i) => i + 1);

export default function GuestForm(props: {
  guest: Guest,
  onEditCloseCallback?: (event: any) => void,
}) {
  const fetcher = useFetcher();

  // global state
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [GUEST_FORM_OPEN, setGuestListFormOpen] = useAtom(guestFormOpenAtom);
  const [SHOW_CONFIRM_DELETE, setShowConfirmDelete] = useState(false);

  // local state
  const [FORM_FIELDS, setFormFields] = useState({
    ...DefaultGuestData,
    name: props.guest.name || "",
    phoneNumber: props.guest.phoneNumber || "",
    partySize: props.guest.partySize || 1,
    extraPlayersString: props.guest.extraPlayersString || "",
    tableType: props.guest.tableType || "Regulation",
    notes: props.guest.notes || "",
  });

  const nameToAddField = useRef<HTMLInputElement>(null);
  const partySizeField = useRef<HTMLSelectElement>(null);
  const extraPlayersField = useRef<HTMLInputElement>(null);
  const tableTypeField = useRef<HTMLSelectElement>(null);
  const notesField = useRef<HTMLTextAreaElement>(null);
  const phoneInputRef = useMask({
    mask: '(___) ___-____',
    replacement: { _: /\d/ },
    showMask: true,
  });

  const saveGuest = async (guest: Guest) => {
    const newState = await AppStorage.saveGuestRemote(guest);
    setAppState(newState);
  }

  const onClickSaveItem = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (!FORM_FIELDS.name.trim().length) return;

    const extraPlayersMap = FORM_FIELDS.extraPlayersString?.split(',').map((v) => v.trim()).filter((v) => v.length);
    const extraPlayersString = extraPlayersMap?.join(', ');
    const extraPlayers = extraPlayersMap?.map((name, index) => ({id: index, name, assignedAt: 0, timeStoppedAt: 0})) || [];

    setFormFields(prev => ({
      ...prev,
      extraPlayers,
      extraPlayersString,
    }));

    const guest: Guest = {
      ...FORM_FIELDS,
      extraPlayersString,
      extraPlayers,
    }
    await saveGuest(guest);
    cleanupForm(event);
  }

  const onClickDeleteItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setShowConfirmDelete(prev => true);
  }

  const onClickConfirmDelete = async () => {
    const appState = await AppStorage.deleteGuestRemote(props.guest.id);
    setAppState(appState);
    setShowConfirmDelete(prev => false);
    //props.setItemExpanded(prev => false);
  }

  const onClickCancelDelete = () => {
    setShowConfirmDelete(prev => false);
  }

  const onClickCancel = (event: any) => {
    event.stopPropagation();
    cleanupForm(event);
  }

  const cleanupForm = (event: any) => {
    if (!props.guest.id) {
      setGuestListFormOpen(false);
    } else {
      props.onEditCloseCallback && props.onEditCloseCallback(event);
    }
  }

  const onChangeField = (event: React.ChangeEvent<any>) => {
    const fieldName = event.target.name
    const value = event.target.value.trim();
    setFormFields(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  }

  const onClickForm = (event: any) => {
    event.stopPropagation();
  }

  useEffect(() => {
    if (!props.guest.id) return;

    setFormFields( prev => ({
      ...prev,
      ...props.guest,
    }));

    nameToAddField.current && (nameToAddField.current.value = props.guest.name);
    partySizeField.current && (partySizeField.current.value = `${props.guest.partySize}`);
    extraPlayersField.current && (extraPlayersField.current.value = props.guest.extraPlayersString || '');
    tableTypeField.current && (tableTypeField.current.value = props.guest.tableType);
    notesField.current && (notesField.current.value = props.guest.notes);
    phoneInputRef.current && (phoneInputRef.current.value = props.guest.phoneNumber || '');
  }, []);

  useEffect(() => {
    if (props.guest.id) return;
    const nameInputField = nameToAddField.current;
    if (!nameInputField) return;
    nameInputField.focus();
  }, [GUEST_FORM_OPEN]);

  return ( <>
    <fetcher.Form method="POST" className={`bg-transparent`} onClick={onClickForm}>
      <div>
        <div className={formColumnStyles}>
          <div className={`${labelStyles} ml-1 mt-4`}>
            Guest Name
          </div>
        </div>
        <div className={formColumnStyles} onDragStart={(event) => {event.preventDefault();event.stopPropagation();}}>
          <div className={`${fieldStyles} flex-grow text-nowrap`}>
            <input ref={nameToAddField}
              required
              name="name"
              onChange={onChangeField}
              className={`${formFieldStylesFullWidth}`}
              placeholder="Enter Guest Name..."
              maxLength={40}/>
          </div>
        </div>
        <div className={formColumnStyles}>
          <div className={`${labelStyles}`}>
            Phone Number
          </div>
        </div>
        <div className={formColumnStyles}>
          <div className={fieldStyles}>
            <input ref={phoneInputRef}
              name="phoneNumber"
              onChange={onChangeField}
              className={`${formFieldStylesFullWidth}`}
              placeholder="Add Phone Number..."
            />
          </div>
        </div>
        <div className="ROW flex relative">
          <div className="COL flex-1">
            <div className={`ROW ${formColumnStyles}`}>
              <div className={`${labelStyles}`}>
                Party Size
              </div>
            </div>
            <div className={`ROW ${formColumnStyles}`}>
              <div className={`flex-1 flex-grow text-nowrap`}>
                <select ref={partySizeField}
                  name="partySize"
                  onChange={onChangeField}
                  defaultValue="1"
                  className={`pb-3 ${formFieldStylesFullWidth}`}
                >
                  {partySizeArray.map((size) => (
                    <option key={size} className={optionStyles} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className={partySizeField.current?.value === '1' ? 'hidden' : ''}>
          <div className={formColumnStyles}>
            <div className={`${labelStyles} ml-1`}>
              Extra Players (comma separated)
            </div>
          </div>
          <div className={formColumnStyles}>
            <div className={`${fieldStyles} flex-grow text-nowrap`}>
              <input ref={extraPlayersField}
                required
                name="extraPlayersString"
                onChange={onChangeField}
                className={`${formFieldStylesFullWidth}`}
                placeholder="Enter Player Names..."
                maxLength={200}/>
            </div>
          </div>
        </div>
        <div className={formColumnStyles}>
          <div className={`${labelStyles} ml-1 mt-1`}>
            Table Type
          </div>
        </div>
        <div className={formColumnStyles}>
          <div className={fieldStyles}>
            <select ref={tableTypeField}
              name="tableType"
              onChange={onChangeField}
              defaultValue="Regulation"
              className={`uppercase bg-transparent pb-3
              ${formFieldStylesFullWidth}`}
            >
              <option className={optionStyles} value="Regulation">Regulation</option>
              <option className={optionStyles} value="Bar">Bar Table</option>
              <option className={optionStyles} value="Pro">Pro Table</option>
            </select>
          </div>
        </div>
        <div className={formColumnStyles}>
          <div className={`${labelStyles} ml-1 mt-1`}>
            Notes
          </div>
        </div>
        <div className={formColumnStyles}>
          <div className={fieldStyles}>
            <textarea ref={notesField}
              name="notes"
              onChange={onChangeField}
              className={`${styles.noScrollbar} text-left resize-none h-24 ${formFieldStylesFullWidth}`}
              maxLength={500}
              placeholder="Add Notes...">
            </textarea>
          </div>
        </div>
      </div>
      <div className="flex items-center mt-1 mb-3 justify-end mr-2">
        <button type="button" onClick={onClickCancel} className={`${actionButtonStyles}`}>
          Cancel
        </button>
        <button onClick={onClickSaveItem} className={actionButtonStyles}>
          Save
        </button>
        {!GUEST_FORM_OPEN && (
          <button className={`!text-red-500 ${actionButtonStyles}`} onClick={onClickDeleteItem}>
            Delete
          </button>
        )}
      </div>
    </fetcher.Form>
    <ModalConfirm
        show={SHOW_CONFIRM_DELETE}
        dialogTitle={`CONFIRM DELETE`}
        dialogMessageFn={() => <span className="text-sm">
          Remove
          <span className="text-red-500 font-bold mx-2">{props.guest.name.toUpperCase()}</span>
          {props.guest.assignedAt ? `from ${APP_STATE.tables.find(_ => _.guest?.id === props.guest.id)?.name.toUpperCase()}` : 'from the Wait List?'}
        </span>}
        onConfirm={onClickConfirmDelete}
        onCancel={onClickCancelDelete}
      />
  </>)
}
