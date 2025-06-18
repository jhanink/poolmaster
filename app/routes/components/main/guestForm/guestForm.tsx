
import { useMask } from '@react-input/mask';
import { useEffect, useState } from "react";
import { DEFAULT_ID, DefaultGuestData, FeatureFlags, PARTY_SIZE_ARRAY, type ExtraPlayer, type Guest } from "~/config/AppState";
import { AppStorage } from "~/util/AppStorage";
import { useAtom } from "jotai";
import { appStateAtom, isSavingAtom, mainTakoverAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import styles from "./guestFormStyles.module.css";
import { actionIconStyles, fieldStyles, formColumnStyles, formFieldStylesFullWidth, formSelectStyles, labelStyles } from "~/util/GlobalStylesUtil";
import { actionButtonStyles, optionStyles } from "~/util/GlobalStylesUtil";
import { useFetcher } from 'react-router';
import ModalConfirm from '../../ui-components/modal/modalConfirm';
import { TrashIcon } from '@heroicons/react/24/outline';

const partySizeArray = [...PARTY_SIZE_ARRAY];
const actionButtons = `${actionButtonStyles} !py-0`;
const tableOrTableTypeStyles = `hover:cursor-pointer ring-1 rounded-full py-1 px-2 text-gray-500 ring-gray-800`;
const tableOrTableTypeSelectedStyles = `bg-green-500 !text-black`;

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
  const [SAVING, setSaving] = useAtom(isSavingAtom);
  const [ATTEMPTED_SAVE, setAttemptedSave] = useState(false);

  // local state
  const [FORM_FIELDS, setFormFields] = useState({
    ...DefaultGuestData,
    name: props.guest.name || "",
    phoneNumber: props.guest.phoneNumber || "",
    partySize: props.guest.partySize || 1,
    extraPlayers: props.guest.extraPlayers || [],
    tableOrTableType: props.guest.tableOrTableType || false,
    tableOrTableTypeId: props.guest.tableOrTableTypeId || DEFAULT_ID,
    usageTypeId: props.guest.usageTypeId || DEFAULT_ID,
    notes: props.guest.notes || "",
    isReservation: props.guest.isReservation || false,
  });

  const phoneInputRef = useMask({
    mask: '(___) ___-____',
    replacement: { _: /\d/ },
    showMask: true,
  });

  const saveGuest = async (guest: Guest) => {
    setSaving(true);
    const newState = await AppStorage.saveGuestRemote(guest);
    setSaving(false);
    setAppState(newState);
  }

  const onClickSaveItem = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    setAttemptedSave(true);
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

  const onClickDeleteItem = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    setShowConfirmDelete(prev => true);
  }

  const onClickConfirmDelete = async () => {
    setSaving(true);
    const appState = await AppStorage.deleteGuestRemote(props.guest.id);
    setSaving(false);
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
        <div className={`${formColumnStyles} !mx-0`}>
          <div className={`${labelStyles} !top-0`}>
            Extra Player Names
            <button className={`${actionButtons} !px-3`} onClick={() => {onClickAddExtraPlayer()}}>+1</button>
          </div>
        </div>
        <div className={`${formColumnStyles} !mx-0`}>
          <div className={`${fieldStyles} flex-grow text-nowrap`}>
            {FORM_FIELDS.extraPlayers.map((player, index) => (
              <div key={index} className={`flex items-center justify-between ${styles.extraPlayerRow}`}>
                <div className="PLAYER_ROW">
                  <div className={`inline-block mr-2 relative top-1 ${!!player.forDelete && 'text-rose-500 hover:text-red-800'} ${!!player.forAdd && 'text-green-500 hover:text-green-800'} ${actionIconStyles}`}
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

  const toggleTableOrTableType = (which: boolean) =>{
    if (which === FORM_FIELDS.tableOrTableType) return;
    FORM_FIELDS.tableOrTableType = !FORM_FIELDS.tableOrTableType;
    FORM_FIELDS.tableOrTableTypeId = DEFAULT_ID;
    setFormFields({...FORM_FIELDS})
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
    <fetcher.Form method="POST" className={`bg-transparent`} onSubmit={onClickSaveItem} onClick={onClickForm}>
      <div>
        <div className={formColumnStyles}>
          <div className={`${labelStyles} ml-1`}>
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
              placeholder="Enter Name..."
              maxLength={40}/>
          </div>
        </div>
        <div className="relative">
          {ATTEMPTED_SAVE && !FORM_FIELDS.name.trim().length && (
            <div className="text-rose-500 text-left ml-3 text-sm top-[-3px] relative">Name is required</div>
          )}
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
              placeholder="Enter Number..."
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
        <div className={`ml-1 p-1 border border-gray-800 rounded-lg mb-2 ${FORM_FIELDS.partySize === 1 ? 'hidden' : ''}`}>
          {fragmentExtraPlayersTable()}
        </div>
        <div className={`ml-1 p-1 border border-gray-800 rounded-lg`}>
          <div className={`${formColumnStyles}`}>
            <div className={`${labelStyles} !mx-0 mb-1`}>
              <div className="flex shrink gap-2 text-xs items-center mb-1">
                <div className={`${tableOrTableTypeStyles} ${!FORM_FIELDS.tableOrTableType && `!bg-blue-400 ${tableOrTableTypeSelectedStyles}`}`}
                  onClick={() => {toggleTableOrTableType(false)}}
                >
                  Table Type
                </div>
                <div>- OR -</div>
                <div className={`${tableOrTableTypeStyles} ${FORM_FIELDS.tableOrTableType && tableOrTableTypeSelectedStyles}`}
                  onClick={() => {toggleTableOrTableType(true)}}
                >
                  Table
                </div>
              </div>
            </div>
          </div>
          <div className={formColumnStyles}>
            <div className={fieldStyles}>
              {FORM_FIELDS.tableOrTableType ? (
                <select
                  name="table"
                  onChange={(event) => {
                    FORM_FIELDS.tableOrTableTypeId = Number(event.target.value);
                    setFormFields({...FORM_FIELDS})
                  }}
                  value={FORM_FIELDS.tableOrTableTypeId}
                  className={`${formSelectStyles} uppercase bg-transparent pb-3 ${formFieldStylesFullWidth}`}
                >
                  {APP_STATE.tables
                    .filter((type) => type.isActive)
                    .map((type) => (
                      <option key={type.id} className={optionStyles} value={type.id}>{type.name}</option>
                    ))
                  }
                </select>
              ) : (
                <select
                  name="tableType"
                  onChange={(event) => {
                    FORM_FIELDS.tableOrTableTypeId = Number(event.target.value);
                    setFormFields({...FORM_FIELDS})
                  }}
                  value={FORM_FIELDS.tableOrTableTypeId}
                  className={`${formSelectStyles} uppercase bg-transparent pb-3 ${formFieldStylesFullWidth}`}
                >
                  {APP_STATE.tableTypes
                    .filter((type) => type.isActive)
                    .map((type) => (
                      <option key={type.id} className={optionStyles} value={type.id}>{type.name}</option>
                    ))
                  }
                </select>
              )}
            </div>
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
              className={`${styles.noScrollbar} text-left resize-none h-12 ${formFieldStylesFullWidth}`}
              maxLength={500}
              placeholder="Add Notes...">
            </textarea>
          </div>
        </div>
        {FeatureFlags.SHOW_RESERVATIONS && (
        <div className={`flex flex-row items-center ml-2 mb-3`}>
          <div className={`${FORM_FIELDS.isReservation ? ' text-green-500' : 'text-gray-700 italic'}`}>
            RESERVATION
          </div>
          <input
            type="checkbox"
            className={`ml-2 size-4`}
            checked={FORM_FIELDS.isReservation}
            onChange={(event) => {
              FORM_FIELDS.isReservation = event.target.checked;
              setFormFields({...FORM_FIELDS})
            }}
          />
        </div>
        )}
      </div>
      <div className="flex items-center mt-1 mb-3 justify-end">
        {!MAIN_TAKEOVER?.addGuest && (
          <div onClick={onClickDeleteItem} className={`!text-rose-500 ${actionButtonStyles} !text-xs`}>
            DELETE
          </div>
        )}
        <div onClick={onClickCancel} className={`${actionButtonStyles} !text-xs`}>
          Cancel
        </div>
        <button disabled={SAVING} type="submit" onClick={onClickSaveItem} className={`${actionButtonStyles} !text-xs`}>
          Save
        </button>

      </div>
    </fetcher.Form>
    <ModalConfirm
      show={SHOW_CONFIRM_DELETE}
      dialogTitle={`CONFIRM DELETE`}
      dialogMessageFn={() => <span className="text-sm">
        Remove
        <span className="text-rose-500 font-bold mx-2">{props.guest.name.toUpperCase()}</span>
        {props.guest.assignedAt ? `from ${APP_STATE.tables.find(_ => _.guest?.id === props.guest.id)?.name.toUpperCase()}?` : 'from the Wait List?'}
      </span>}
      onConfirm={onClickConfirmDelete}
      onCancel={onClickCancelDelete}
    />
  </>)
}
