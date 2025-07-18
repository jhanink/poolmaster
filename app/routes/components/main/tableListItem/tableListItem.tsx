import { type TableItem } from "~/config/AppState";
import styles from "./tableListItemStyles.module.css";
import GuestItem from "../guestItem/guestItem";
import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { appStateAtom, selectedTableAtom, tableExpandAllAtom } from "~/appStateGlobal/atoms";
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
    const [ITEM_EXPANDED, setItemExpanded] = useState(false);
    const [EDIT_FORM, setEditForm] = useState(false);
    const [TABLE_EXPAND_ALL] = useAtom(tableExpandAllAtom);

    const table = props.table;

    useEffect(() => {
      const expand = TABLE_EXPAND_ALL;
      setItemExpanded(expand);
  }, [TABLE_EXPAND_ALL]);

    const onClickTable = (event: React.MouseEvent<HTMLDivElement>) => {
      if (ITEM_EXPANDED || !props.table.guest) {
        return;
      }
      setItemExpanded(true);
    }

    const onClickCloseExpanded = (event: React.MouseEvent<HTMLDivElement>) => {
      setItemExpanded(prev => false);
      setEditForm(prev => false);
      setSelectedTable(undefined as TableItem);
    }

    const IS_EXPIRED = Helpers.isExpiredVisit(table.guest);
    const EXPIRED_OVERRIDE = (IS_EXPIRED && 'border-dashed !border-gray-800 hover:!cursor-default') || (SELECTED_TABLE && '!border-white');

    return (
      <div className={`${EXPIRED_OVERRIDE} ${guestAssigned} hover:cursor-pointer relative`} onClick={onClickTable}>
        <div className="uppercase text-sm">
          <div  onClick={onClickCloseExpanded} className="relative">
            <div className="">
              <div>{table.name}</div>
            </div>
            <div className="text-gray-500 text-xs ">
              {Helpers.getTableType(APP_STATE, table.tableTypeId).name}
            </div>
            <div className="absolute top-0 left-3 hover:cursor-pointer">
              {table.guest && ITEM_EXPANDED && !SELECTED_TABLE && !IS_EXPIRED && <>
                <div className="text-gray-500">
                  <XMarkIcon aria-hidden="true" className="inline-block text-right mr-3 size-5 hover:stroke-white" />
                </div>
              </>}
            </div>
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
