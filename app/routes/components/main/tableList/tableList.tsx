import mainStyles from '../mainStyles.module.css';
import styles from "./tableListStyles.module.css";

import { FeatureFlags, type TableItem } from "~/config/AppState";
import TableListItem from "../tableListItem/tableListItem";
import { useAtom } from "jotai";
import { appStateAtom, selectedTableAtom, tableExpandAllAtom } from "~/appStateGlobal/atoms";
import React, { useEffect, useRef, useState } from 'react';
import { Helpers } from "~/util/Helpers";
import { columnItemListStyles, mainColumnContentStyles, mainColumnStyles, mainListSwimLaneHeader, selectedTableChipStyle, tableChipsStyle } from "~/util/GlobalStylesUtil";
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

type TableRefs = {
  [key: number]: React.RefObject<HTMLDivElement | null>;
};

export default function TableList() {
  const [APP_STATE] = useAtom(appStateAtom);
  const [SELECTED_TABLE, setSelectedTable] = useAtom(selectedTableAtom);
  const [TABLE_REFS, setTableRefs] = useState<TableRefs>({});
  const [TABLE_EXPAND_ALL, setTableExpandAll] = useAtom(tableExpandAllAtom);

  const tables = Helpers.tables(APP_STATE);
  const miniMapRef = useRef<HTMLDivElement>(null);

  const onClickExpandAll = () => {
    setTableExpandAll(!TABLE_EXPAND_ALL);
  }

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
      <div className={`MINIMAP CHIPS flex flex-wrap gap-2 justify-center ${Helpers.tablesAssigned(APP_STATE).length && 'mb-2'}`} ref={miniMapRef}>
        {Helpers.tablesAssigned(APP_STATE)
          .sort((A: TableItem, B: TableItem) => A.number - B.number)
          .map((table: TableItem, index: number) =>
            <button className={`CHIP ${tableChipsStyle} ${SELECTED_TABLE?.id === table.id ? selectedTableChipStyle : ''} uppercase !m-0 hover:cursor-pointer`}
              key={table.id}
              data-table-id={table.id}
              onClick={(event) => onClickTableChip(event, table)}
            >
              <div>{table.name}</div>
              {APP_STATE.adminSettings.showTableChipInfo && (<>
                <div className={`uppercase italic text-[10px] text-gray-500 !font-normal ml-2`}>
                  {table.guest.name}
                </div>
                {table.guest.partySize > 1 && (<>
                  <div className="text-gray-400 text-[10px] mx-1">:</div>
                  <div className="text-gray-400 text-[10px]">{table.guest.partySize}</div>
                </>)}
              </>)}
            </button>
        )}
      </div>
    )
  }

  const fragmentSwimlaneHeader = () => {
    return FeatureFlags.SHOW_MAIN_SWIMLANES && (<>
      <div className={`${mainListSwimLaneHeader}`}>
        <div className="flex items-center w-full">
          <div className="text-transparent size-5">
            <ArrowsPointingOutIcon></ArrowsPointingOutIcon>
          </div>
          <div className="grow">
            <span>Tables: <span className="text-gray-300 ml-2">{Helpers.tablesAssigned(APP_STATE).length}</span></span>
          </div>
          {TABLE_EXPAND_ALL ? (
            <div className="size-5 hover:cursor-pointer text-sky-500" onClick={() => {onClickExpandAll()}}>
              <ArrowsPointingInIcon></ArrowsPointingInIcon>
            </div>
          ) : (
            <div className="text-gray-500 size-5 hover:cursor-pointer hover:text-white" onClick={() => {onClickExpandAll()}}>
              <ArrowsPointingOutIcon></ArrowsPointingOutIcon>
            </div>
          )}
        </div>
      </div>
    </>)
  }

  const fragmentTables = () => {
    return (
      <div className={`${columnItemListStyles}`}>
        {Helpers.tablesAssigned(APP_STATE)
          .filter((table) => TABLE_EXPAND_ALL
            || (!Helpers.showTableListCards(APP_STATE) ? table.id === SELECTED_TABLE?.id : true)
            || Helpers.isExpiredVisit(table.guest)
          )
          .sort((A: TableItem, B: TableItem) => {
            if (!Helpers.isExpiredVisit(A.guest) && Helpers.isExpiredVisit(B.guest)) {
              return -1;
            }
            if (!Helpers.isExpiredVisit(B.guest) && Helpers.isExpiredVisit(A.guest)) {
              return 1;
            }
            return A.number - B.number;
          })
          .map((table, index) => (
            <div
              key={table.id}
              ref={TABLE_REFS[`${table.id}`]}
              className={`${SELECTED_TABLE && SELECTED_TABLE.id !== table.id ? "hidden" : ""}`}
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
    <div className={`${mainColumnStyles}`}>
      {fragmentSwimlaneHeader()}
      <div className={`${mainStyles.column} ${styles.tableList} ${mainColumnContentStyles}`}>
        {fragmentMiniMap()}
        {fragmentTables()}
      </div>
      <div className={`${styles.bottomScrollSpacer}`}>&nbsp;</div>
    </div>
  )
}
