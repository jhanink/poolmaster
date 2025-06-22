import mainStyles from '../mainStyles.module.css';
import styles from "./tableListStyles.module.css";

import { FeatureFlags, type TableItem } from "~/config/AppState";
import TableListItem from "../tableListItem/tableListItem";
import { useAtom } from "jotai";
import { appStateAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import React, { useEffect, useRef, useState } from 'react';
import { Helpers } from "~/util/Helpers";
import { selectedTableChipStyle, tableChipsStyle } from "~/util/GlobalStylesUtil";

type TableRefs = {
  [key: number]: React.RefObject<HTMLDivElement | null>;
};

const columnBorders = `${FeatureFlags.SHOW_MAIN_SWIMLANES && 'md:border border-gray-900 rounded-xl md:mr-3 sm:mx-auto md:mx-0'}`;

export default function TableList() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [SELECTED_TABLE, setSelectedTable] = useAtom(selectedTableAtom);
  const [TABLE_REFS, setTableRefs] = useState<TableRefs>({});

  const tables = Helpers.tables(APP_STATE);
  const miniMapRef = useRef<HTMLDivElement>(null);

  const onClickTableChip = (event: React.MouseEvent<HTMLButtonElement>, table: TableItem) => {
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

  const fragmentMiniMap = () => {
    return (
      <div className="MINIMAP CHIPS my-2 mt-3 mb-5 top-0 z-10 flex flex-wrap gap-2 justify-center" ref={miniMapRef}>
        {Helpers.tablesAssigned(APP_STATE)
          .sort((A: TableItem, B: TableItem) => A.number - B.number)
          .map((table: TableItem, index: number) =>
            <button className={`CHIP hover: ${tableChipsStyle} ${SELECTED_TABLE?.id === table.id ? selectedTableChipStyle : ''} uppercase !m-0 hover:cursor-pointer`}
              key={table.id}
              data-table-id={table.id}
              onClick={(event) => onClickTableChip(event, table)}
            >
              {table.name}
              {APP_STATE.adminSettings.showTableChipInfo && (
                <div className={`uppercase italic text-[10px] text-gray-500 !font-normal`}>
                  {table.guest.name} {table.guest.partySize > 1 && (<>
                    : <span className="text-gray-300">{table.guest.partySize}</span>
                  </>)}
                </div>
              )}
            </button>
        )}
      </div>
    )
  }

  const fragmentTables = () => {
    return (
      <div>
        {tables
          .filter((table) => table.guest)
          .sort((A: TableItem, B: TableItem) =>
            A.number - B.number
          )
          .map((table, index) => (
            <div
              key={table.id}
              ref={TABLE_REFS[`${table.id}`]}
              className={`mb-5 ${SELECTED_TABLE && SELECTED_TABLE.id !== table.id ? "hidden" : ""}`}
            >
              <TableListItem table={table} index={index} tableRef={TABLE_REFS[`${table.id}`]} />
            </div>
          )
        )}
      </div>
    )
  }

    const fragmentSwimlaneHeader = () => {
    return FeatureFlags.SHOW_MAIN_SWIMLANES && (<>
      <div className="sticky bg-gray-800/40 relative top-[-1px] z-9 bg-black md:flex hidden border-b border-gray-900 p-2 text-xl items-center text-gray-200 rounded-t-xl">
        <div className="flex items-center w-full">
        <div className="grow">
          Table List
        </div>
        </div>
      </div>
    </>)
  }

  useEffect(() => {
    const tableRefs: TableRefs = {};
    APP_STATE.tables.forEach((table) => {tableRefs[`${table.id}`] = React.createRef<HTMLDivElement>()});
    setTableRefs(tableRefs);
  }, [APP_STATE.tables]);

  return (
    <div className={`flex-1 text-center select-none ${columnBorders} min-w-[350px] max-w-[600px]`}>
      {fragmentSwimlaneHeader()}
      <div className={`${mainStyles.column} ${styles.tableList} px-2`}>
        {fragmentMiniMap()}
        {fragmentTables()}
      </div>
      <div className={`${styles.bottomScrollSpacer}`}>&nbsp;</div>
    </div>
  )
}
