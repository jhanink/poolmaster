import { type TableItemData } from "~/config/AppState";
import styles from "./tableListItemStyles.module.css";
import GuestItem from "../guestItem/guestItem";
import React, { useEffect, useState } from "react";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { ListFilterTypeEnum, selectedListFilterAtom, selectedTableAtom } from "~/appStateGlobal/atoms";

const cardStyle = `${styles.itemCard} select-none py-2 text-gray-700 border border-gray-800 rounded-xl`;
const guestUnassigned =`${cardStyle} text-gray-700`;
const guestAssigned = `${cardStyle} border-green-800 text-green-700`;

export default function TableListItem(props: {
    table: TableItemData,
    index: number,
    tableRef: React.RefObject<HTMLDivElement | null>,
  }) {
    const [SELECTED_TABLE, setSelectedTable] = useAtom(selectedTableAtom);
    const [SELECTED_LIST_FILTER] = useAtom(selectedListFilterAtom);
    const [ITEM_EXPANDED, setItemExpanded] = useState(false);
    const [EDIT_FORM, setEditForm] = useState(false);

    const table = props.table;

    useEffect(() => {
      switch (SELECTED_LIST_FILTER) {
        case (ListFilterTypeEnum.TABLELIST):
          setItemExpanded(true);
          break;
        default:
          setItemExpanded(false);
      }
    }, [SELECTED_LIST_FILTER]);

    const onClickTable = (event: React.MouseEvent<HTMLDivElement>) => {
      if (ITEM_EXPANDED || !props.table.guest) {
        return;
      }
      setItemExpanded(true);
    }

    const onClickCloseExpanded = (event: React.MouseEvent<HTMLDivElement>) => {
      setItemExpanded(prev => false);
      setEditForm(prev => false);
      setSelectedTable(undefined as TableItemData);
    }

    return (
      <div className={`${SELECTED_TABLE && 'border-white'} ${table.guest ? guestAssigned : guestUnassigned} hover:cursor-pointer relative`} onClick={onClickTable}>
        <div className="uppercase text-sm">
          <div>
            {table.nickname || table.name}
            <div className="absolute top-2 right-0 hover:cursor-pointer">
              {table.guest && ITEM_EXPANDED && !SELECTED_LIST_FILTER && !SELECTED_TABLE && <>
                <div className="text-gray-500" onClick={onClickCloseExpanded}>
                  <ArrowsPointingInIcon aria-hidden="true" className="inline-block text-right mr-3 size-7 hover:stroke-white" />
                </div>
              </>}
            </div>
          </div>
          <div className="text-gray-700">{table.type}</div>
        </div>
        {table.guest && (
          <div className="ml-3">
            {props.table.guest && (
              <GuestItem guest={table.guest}
                index={0}
                isAssigned={true}
                itemExpanded={!!SELECTED_TABLE || ITEM_EXPANDED}
                setItemExpanded={setItemExpanded}
                isEditForm={EDIT_FORM}
                setEditForm={setEditForm}>
              </GuestItem>
            )}
          </div>
        )}
      </div>
    );
}
