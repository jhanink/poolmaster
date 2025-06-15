import styles from "./tableListStyles.module.css";
import mainStyles from '../mainStyles.module.css'
import { type TableItem } from "~/config/AppState";
import TableListItem from "../tableListItem/tableListItem";
import { useAtom } from "jotai";
import { appStateAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import React, { useEffect, useRef, useState } from 'react';
import { Helpers } from "~/util/Helpers";
import { selectedTableChipStyle, tableChipAssigned } from "~/util/GlobalStylesUtil";

type TableRefs = {
  [key: number]: React.RefObject<HTMLDivElement | null>;
};

export default function TableList() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [SELECTED_TABLE, setSelectedTable] = useAtom(selectedTableAtom);
  const [TABLE_REFS, setTableRefs] = useState<TableRefs>({});

  const tables = Helpers.tables(APP_STATE);
  const miniMapRef = useRef<HTMLDivElement>(null);

  const onClickTableChip = (event: React.MouseEvent<HTMLDivElement>, table: TableItem) => {
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
      <div className="MINIMAP CHIPS my-2 mt-3 mb-5 top-0 z-10" ref={miniMapRef}>
        {Helpers.tablesAssigned(APP_STATE)
          .sort((A: TableItem, B: TableItem) => A.number - B.number)
          .map((table: TableItem, index: number) =>
            <div className={`CHIP ${tableChipAssigned} ${SELECTED_TABLE?.id === table.id ? selectedTableChipStyle : ''}`}
              key={table.id}
              data-table-id={table.id}
              onClick={(event) => onClickTableChip(event, table)}
            >
              {table.name}
              <div className="uppercase italic !text-xs text-gray-500 mt-1 !font-normal">
                {table.guest.name} {table.guest.partySize > 1 && (<>
                  : <span className="text-gray-300">{table.guest.partySize}</span>
                </>)}
              </div>
            </div>
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

  useEffect(() => {
    const tableRefs: TableRefs = {};
    APP_STATE.tables.forEach((table) => {tableRefs[`${table.id}`] = React.createRef<HTMLDivElement>()});
    setTableRefs(tableRefs);
  }, [APP_STATE.tables]);

  return (
    <div className={`${styles.tableListContainer} mx-auto flex-1 max-w-xl text-center select-none`}>
      <div className={`${mainStyles.column} ${styles.tableList}`}>
        {fragmentMiniMap()}
        {fragmentTables()}
      </div>
      <div className={`${styles.bottomScrollSpacer}`}>&nbsp;</div>
    </div>
  )
}
