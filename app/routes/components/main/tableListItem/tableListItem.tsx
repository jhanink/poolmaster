import { type TableItem } from "~/config/AppState";
import styles from "./tableListItemStyles.module.css";
import GuestItem from "../guestItem/guestItem";
import React, { useEffect, useState } from "react";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { appStateAtom, ListFilterTypeEnum, selectedListFilterAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { Helpers } from "~/util/Helpers";
import ExpiredVisit from "../expiredVisit/expiredVisit";

const cardStyle = `${styles.itemCard} select-none pt-2 text-gray-700 border border-gray-900 rounded-xl`;
const guestAssigned = `${cardStyle} border-green-900 text-green-700`;

export default function TableListItem(props: {
    table: TableItem,
    index: number,
    tableRef: React.RefObject<HTMLDivElement | null>,
  }) {
    const [APP_STATE] = useAtom(appStateAtom);
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
      if (SELECTED_LIST_FILTER === ListFilterTypeEnum.TABLELIST) return;
      setItemExpanded(prev => false);
      setEditForm(prev => false);
      setSelectedTable(undefined as TableItem);
    }

    const IS_EXPIRED = Helpers.isExpiredVisit(table.guest);
    const EXPIRED_OVERRIDE = (IS_EXPIRED && 'border-dashed !border-gray-800 hover:!cursor-default') || (SELECTED_TABLE && '!border-white');

    return (
      <div className={`${EXPIRED_OVERRIDE} ${guestAssigned} hover:cursor-pointer relative`} onClick={onClickTable}>
        <div className="uppercase text-sm">
          <div  onClick={onClickCloseExpanded}>
            <span>{table.name}</span>
            <div className="absolute top-2 right-0 hover:cursor-pointer">
              {table.guest && ITEM_EXPANDED && !SELECTED_LIST_FILTER && !SELECTED_TABLE && !IS_EXPIRED && <>
                <div className="text-gray-500">
                  <ArrowsPointingInIcon aria-hidden="true" className="inline-block text-right mr-3 size-7 hover:stroke-white" />
                </div>
              </>}
            </div>
          </div>
          <div className="text-gray-500 text-xs italic">
            {Helpers.getTableType(APP_STATE, table.tableTypeId).name}
          </div>
        </div>

        {IS_EXPIRED ? (
          <ExpiredVisit guest={table.guest} />
        ) : (
          <div className="ml-1">
            <GuestItem guest={table.guest}
              index={0}
              isAssigned={true}
              itemExpanded={!!SELECTED_TABLE || ITEM_EXPANDED}
              setItemExpanded={setItemExpanded}
              isEditForm={EDIT_FORM}
              setEditForm={setEditForm}>
            </GuestItem>
          </div>
        )}
      </div>
    );
}
