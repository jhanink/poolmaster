import { type TableItemData } from "~/config/AppState";
import styles from "./tableListItemStyles.module.css";
import GuestItem from "../guestItem/guestItem";
import React, { useEffect, useState } from "react";
import { TrashIcon, PencilSquareIcon, ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { manageTablesAtom, selectedTableAtom } from "~/appStateGlobal/atoms";

const cardStyle = `${styles.itemCard} select-none p-2 text-gray-700 border border-gray-800 rounded-xl`;
const guestUnassigned =`${cardStyle} text-gray-700`;
const guestAssigned = `${cardStyle} border-green-800 text-green-700`;

export default function TableListItem(props: {
    table: TableItemData,
    index: number,
    tableRef: React.RefObject<HTMLDivElement | null>,
  }) {
    const [isManageTables, setManageTables] = useAtom(manageTablesAtom);
    const [ITEM_EXPANDED, setItemExpanded] = useState(false);
    const [EDIT_FORM, setEditForm] = useState(false);
    const [SELECTED_TABLE, setSelectedTable] = useAtom(selectedTableAtom);
    const table = props.table;

    useEffect(() => {
      if (SELECTED_TABLE && SELECTED_TABLE.id !== table.id) {
        //setItemExpanded(false);
      }
    }, [SELECTED_TABLE]);

    const onTableClicked = (event: React.MouseEvent<HTMLDivElement>) => {
      if (ITEM_EXPANDED || !props.table.guest) {
        return;
      }
      setItemExpanded(true);
    }

    const onCloseExpandedClicked = (event: React.MouseEvent<HTMLDivElement>) => {
      setItemExpanded(prev => false);
      setEditForm(prev => false);
      setSelectedTable(undefined as TableItemData);
    }

    const onClickEditTable = (event: React.MouseEvent<HTMLDivElement>) => {

    }

    const onClickDeleteTable = (event: React.MouseEvent<HTMLDivElement>) => {

    }

    return (
      <div className={`${SELECTED_TABLE && 'border-white'} ${table.guest ? guestAssigned : guestUnassigned} hover:cursor-pointer relative`} onClick={onTableClicked}>
        <div className="uppercase">
          <div className="text-xl">
            {table.nickname || table.name}
            <div className="absolute top-2 right-0 hover:cursor-pointer">
              {isManageTables && <>
                <div>
                  <span onClick={onClickEditTable}><PencilSquareIcon className="inline-block ml-2 mr-2 size-6 text-gray-500"></PencilSquareIcon></span>
                  {!props.table.guest && <>
                    <span onClick={onClickDeleteTable}><TrashIcon className="inline-block ml-2 size-6 text-gray-500"></TrashIcon></span>
                  </>}
                </div>
              </>}
              {table.guest && ITEM_EXPANDED && <>
                <div className="text-gray-500" onClick={onCloseExpandedClicked}>
                  <ArrowsPointingInIcon aria-hidden="true" className="inline-block text-right mr-3 size-7 hover:stroke-white" />
                </div>
              </>}
            </div>
          </div>
          <div className="text-gray-700">{table.type}</div>
        </div>
        {table.guest && (
          <>
            {props.table.guest && (
              <GuestItem guest={table.guest} index={0} isAssigned={true} itemExpanded={ITEM_EXPANDED} setItemExpanded={setItemExpanded} isEditForm={EDIT_FORM} setEditForm={setEditForm}></GuestItem>
            )}
          </>
        )}
      </div>
    );
}
