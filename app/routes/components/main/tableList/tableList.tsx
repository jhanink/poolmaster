import styles from "./tableListStyles.module.css";
import mainStyles from '../mainStyles.module.css'
import { type TableItemData } from "~/config/AppState";
import TableListItem from "../tableListItem/tableListItem";
import { useAtom } from "jotai";
import { appStateAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import React, { useEffect, useRef, useState } from 'react';

const assignedStyle = `inline-block m-1 mb-2 rounded-full py-1 px-4 text-xs border border-green-800 text-green-600 font-bold hover:cursor-pointer`;
const unassignedStyle = `inline-block m-1 mb-2 rounded-full py-1 px-4 text-xs border border-gray-700 text-gray-600 font-bold  `;
const selectedChipStyle = `ring-2 ring-white`;

// className={`${dropTargetDefaultStyle} ${canDrop ? (isOver? dropTargetOverStyle : dropTargetActiveStyle) : ''}`}
export const dropTargetActiveStyle = `desktop:bg-green-300 desktop:invert`;
export const dropTargetOverStyle = `desktop:blur-[2px] desktop:bg-white`;

type TableRefs = {
  [key: number]: React.RefObject<HTMLDivElement | null>;
};

export default function TableList() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [TABLE_REFS, setTableRefs] = useState<TableRefs>({});
  const [SELECTED_TABLE, setSelectedTable] = useAtom(selectedTableAtom);

  const tables = APP_STATE.tables;
  const miniMapRef = useRef<HTMLDivElement>(null);

  const onClickTableChip = (event: React.MouseEvent<HTMLDivElement>, table: TableItemData) => {
    if (!table.guest) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (table.id === SELECTED_TABLE?.id) {
      setSelectedTable(undefined);
    } else {
      setSelectedTable(table);
    }
  }

  useEffect(() => {
    const tableRefs: TableRefs = {};
    APP_STATE.tables.forEach((table) => {tableRefs[`${table.id}`] = React.createRef<HTMLDivElement>()});
    setTableRefs(tableRefs);
  }, [APP_STATE.tables]);

  return (
    <div className={`${styles.tableListContainer} mx-auto flex-1 max-w-xl text-center select-none`}>
      <div className={`MINIMAP CHIPS ${mainStyles.column} ${styles.tableList}`}>
        <div className="my-3 top-0 z-10" ref={miniMapRef}>
          {
            tables
              .sort((A: TableItemData, B: TableItemData) =>
                A.number - B.number
              )
              .map((table: TableItemData, index: number) =>
                <div className={`CHIP ${table.guest ? assignedStyle : unassignedStyle} ${SELECTED_TABLE?.id === table.id ? selectedChipStyle : ''}`}
                  key={table.id}
                  data-table-id={table.id}
                  onClick={(event) => onClickTableChip(event, table)}
                >
                  {table.nickname || table.name}
                </div>
              )
          }
        </div>
        <div className="text-gray-200 text-sm mt-3 p-3 text-gray-500">
          {
            SELECTED_TABLE ? `Selected Table` : `Active Tables (${tables.filter((table) => table.guest).length})`
          }
        </div>
        {
          SELECTED_TABLE && (
            tables.filter((table) => table.id === SELECTED_TABLE.id)
              .map((table: TableItemData, index: number) =>
                <div key={table.id}>
                  <div className={`border border-4 border-white rounded-2xl p-3 mb-40`}>
                    <TableListItem table={table} index={index} tableRef={TABLE_REFS[`${table.id}`]}></TableListItem>
                  </div>
                </div>
              )
            )
        }
        {
          !SELECTED_TABLE && (
            tables.filter((table) => table.guest)
            .sort((A: TableItemData, B: TableItemData) =>
              A.number - B.number
            )
            .map((table: TableItemData, index: number) =>
              <div key={table.id} ref={TABLE_REFS[`${table.id}`]} className={`mb-5`}>
                <TableListItem table={table} key={table.id} index={index} tableRef={TABLE_REFS[`${table.id}`]}></TableListItem>
              </div>
            )
          )
        }
      </div>
      <div className={`${styles.bottomScrollSpacer}`}>&nbsp;</div>
    </div>
  )
}