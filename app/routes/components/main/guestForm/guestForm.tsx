
import { useMask } from '@react-input/mask';
import React, { useEffect, useState } from "react";
import { DEFAULT_ID, DefaultGuestData, PARTY_SIZE_ARRAY, type ExtraPlayer, type Guest } from "~/config/AppState";
import { AppStorage } from "~/util/AppStorage";
import { useAtom } from "jotai";
import { appStateAtom, mainTakoverAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import styles from "./guestFormStyles.module.css";
import { actionIconStyles, formFieldStylesFullWidth, formSelectStyles } from "~/util/GlobalStylesUtil";
import { actionButtonStyles, optionStyles } from "~/util/GlobalStylesUtil";
import { useFetcher } from 'react-router';
import ModalConfirm from '../../ui-components/modal/modalConfirm';
import { TrashIcon } from '@heroicons/react/24/outline';

const formColumnStyles = `COLUMN flex m-1`;
const fieldStyles = `flex-1`;
const labelStyles = `text-sm text-gray-400 ml-1 top-2 relative`;
const partySizeArray = [...PARTY_SIZE_ARRAY];
const actionButtons = `${actionButtonStyles} !py-0`;

export default function GuestForm(props: {
  guest: Guest,
  onEditCloseCallback?: (event: any) => void,
}) {
  const fetcher = useFetcher();

  // global state
  const [APP_STATE, setAppState] = useAtom(appStateAtom);
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);
  const [, setSelectedTable] = useAtom(selectedTableAtom);
  const [SHOW_CONFIRM_DELETE, setShowConfirmDelete] = useState(false);

  // local state
  const [FORM_FIELDS, setFormFields] = useState({
    ...DefaultGuestData,
    name: props.guest.name || "",
    phoneNumber: props.guest.phoneNumber || "",
    partySize: props.guest.partySize || 1,
    extraPlayers: props.guest.extraPlayers || [],
    tableTypeId: props.guest.tableTypeId || DEFAULT_ID,
    usageTypeId: props.guest.usageTypeId || DEFAULT_ID,
    notes: props.guest.notes || "",
  });

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

    const extraPlayers = FORM_FIELDS.extraPlayers
      .map((player: ExtraPlayer) => ({...player, forAdd: false}))
      .filter((player: ExtraPlayer) => !player.forDelete && player.name.trim().length);

    setFormFields(prev => ({
      ...prev,
      extraPlayers,
    }));

    const guest: Guest = {
      ...FORM_FIELDS,
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
    cleanupForm();
  }

  const onClickCancelDelete = () => {
    setShowConfirmDelete(prev => false);
  }

  const onClickCancel = (event: any) => {
    event.stopPropagation();
    cleanupForm(event);
  }

  const cleanupForm = (event?: any) => {
    if (props.guest.id) {
      props.onEditCloseCallback && props.onEditCloseCallback(event);
    }
    setSelectedTable(undefined);
    setMainTakeover(undefined);
  }

  const onClickForm = (event: any) => {
    event.stopPropagation();
  }

  const onClickForDelete = (player: ExtraPlayer) => {
    const PLAYERS = FORM_FIELDS.extraPlayers;
    if (player.forAdd) {
      PLAYERS.splice(PLAYERS.indexOf(player), 1);
      setFormFields(prev => ({
        ...prev,
        extraPlayers: PLAYERS,
      }));
      return;
    }
    player.forDelete = !player.forDelete;
    setFormFields(prev => ({
      ...prev,
      extraPlayers: PLAYERS,
    }));
  }

  const onClickAddExtraPlayer = () => {
    const newExtraPlayers = [...FORM_FIELDS.extraPlayers, {
      id: Date.now() + FORM_FIELDS.extraPlayers.length + 1,
      name: '',
      assignedAt: 0,
      forAdd: true,
      forDelete: false,
      timeStoppedAt: 0
    }];
    setFormFields(prev => ({
      ...prev,
      extraPlayers: newExtraPlayers,
    }));
  }

  const fragmentExtraPlayersTable = () => {
    return (<>
      {FORM_FIELDS.partySize > 1 && (<>
        <div className={formColumnStyles}>
          <div className={`${labelStyles} mb-2`}>
            Extra Player Names
            <button className={`${actionButtons}`} onClick={() => {onClickAddExtraPlayer()}}>+1</button>
          </div>
        </div>
        <div className={formColumnStyles}>
          <div className={`${fieldStyles} flex-grow text-nowrap`}>
            {FORM_FIELDS.extraPlayers.map((player, index) => (
              <div key={index} className={`flex items-center justify-between ${styles.extraPlayerRow}`}>
                <div className="PLAYER_ROW">
                  <div className={`inline-block mr-2 relative top-1 ${!!player.forDelete && 'text-red-500 hover:text-red-800'} ${!!player.forAdd && 'text-green-500 hover:text-green-800'} ${actionIconStyles}`}
                    onClick={() => {onClickForDelete(player)}}>
                    <TrashIcon></TrashIcon>
                  </div>
                  <div className="inline-block text-sm text-gray-400 ml-1">
                    <input
                      name="extraPlayerName"
                      required
                      value={player.name}
                      onChange={(event) => {
                        player.name = event.target.value;
                        const newExtraPlayers = FORM_FIELDS.extraPlayers.map((_, i) => i === index ? player : _);
                        setFormFields(prev => ({
                          ...prev,
                          extraPlayers: newExtraPlayers,
                        }));
                      }}
                      className={`${formFieldStylesFullWidth}`}
                      placeholder="Enter Player Name..."
                      maxLength={200}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>)}
    </>)
  }

  useEffect(() => {
    if (!props.guest.id) return;

    setFormFields( prev => ({
      ...prev,
      ...props.guest,
    }));
    phoneInputRef.current && (phoneInputRef.current.value = props.guest.phoneNumber || '');
  }, []);

  return ( <>
    <fetcher.Form method="POST" className={`bg-transparent`} onClick={onClickForm}>
      <div>
        <div className={formColumnStyles}>
          <div className={`${labelStyles} ml-1 mt-4`}>
            Guest Name *
          </div>
        </div>
        <div className={formColumnStyles} onDragStart={(event) => {event.preventDefault();event.stopPropagation();}}>
          <div className={`${fieldStyles} flex-grow text-nowrap`}>
            <input
              required
              name="name"
              onChange={(event) => {
                FORM_FIELDS.name = event.target.value;
                setFormFields({...FORM_FIELDS})
               }}
               value={FORM_FIELDS.name}
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
            <input
              ref={phoneInputRef}
              name="phoneNumber"
              onChange={(event) => {
                FORM_FIELDS.phoneNumber = event.target.value;
                setFormFields({...FORM_FIELDS})
              }}
              value={FORM_FIELDS.phoneNumber}
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
                <select
                  name="partySize"
                  onChange={(event) => {
                    FORM_FIELDS.partySize = Number(event.target.value);
                    setFormFields({...FORM_FIELDS})
                  }}
                  value={FORM_FIELDS.partySize}
                  className={`${formSelectStyles} pb-3 ${formFieldStylesFullWidth}`}
                >
                  {partySizeArray.map((size) => (
                    <option key={size} className={optionStyles} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className={`${FORM_FIELDS.partySize === 1 ? 'hidden' : ''}`}>
          {fragmentExtraPlayersTable()}
        </div>
        <div className={formColumnStyles}>
          <div className={`${labelStyles} ml-1 mt-1`}>
            Table Type
          </div>
        </div>
        <div className={formColumnStyles}>
          <div className={fieldStyles}>
            <select
              name="tableType"
              onChange={(event) => {
                FORM_FIELDS.tableTypeId = Number(event.target.value);
                setFormFields({...FORM_FIELDS})
              }}
              value={FORM_FIELDS.tableTypeId}
              className={`${formSelectStyles} uppercase bg-transparent pb-3 ${formFieldStylesFullWidth}`}
            >
              {APP_STATE.tableTypes
                .filter((type) => type.isActive)
                .map((type) => (
                  <option key={type.id} className={optionStyles} value={type.id}>{type.name}</option>
                ))
              }
            </select>
          </div>
        </div>
        <div className={formColumnStyles}>
          <div className={`${labelStyles} ml-1 mt-1`}>
            Usage Type
          </div>
        </div>
        <div className={formColumnStyles}>
          <div className={fieldStyles}>
            <select
              name="usageType"
              onChange={(event) => {
                FORM_FIELDS.usageTypeId = Number(event.target.value);
                setFormFields({...FORM_FIELDS})
              }}
              value={FORM_FIELDS.usageTypeId}
              className={`${formSelectStyles} uppercase bg-transparent pb-3 ${formFieldStylesFullWidth}`}
            >
              {APP_STATE.usageTypes
                .filter((type) => type.isActive)
                .map((type) => (
                  <option key={type.id} className={optionStyles} value={type.id}>{type.name}</option>
                ))
              }
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
            <textarea
              name="notes"
              onChange={(event) =>{
                FORM_FIELDS.notes = event.target.value;
                setFormFields({...FORM_FIELDS})
              }}
              value={FORM_FIELDS.notes}
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
        {!MAIN_TAKEOVER?.addGuest && (
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
          {props.guest.assignedAt ? `from ${APP_STATE.tables.find(_ => _.guest?.id === props.guest.id)?.name.toUpperCase()}?` : 'from the Wait List?'}
        </span>}
        onConfirm={onClickConfirmDelete}
        onCancel={onClickCancelDelete}
      />
  </>)
}
