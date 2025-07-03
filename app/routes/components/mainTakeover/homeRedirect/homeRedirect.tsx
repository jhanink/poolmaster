import { useAtom } from "jotai";
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { guestExpandAllAtom, isQuietModeAtom, mainTakoverAtom, selectedListFilterAtom, selectedTableAtom, tableExpandAllAtom } from "~/appStateGlobal/atoms";

export default function HomeRedirect() {
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);
  const [, setSelectedListFilter] = useAtom(selectedListFilterAtom);
  const [, setSelectedTable] = useAtom(selectedTableAtom);
  const [, setQuietMode] = useAtom(isQuietModeAtom);
  const [, setSearchParams] = useSearchParams();
  const [, setTableExpandAll] = useAtom(tableExpandAllAtom);
  const [, setGuestExpandAll] = useAtom(guestExpandAllAtom);

  const onClickRedirect = () => {
    setSearchParams({});
    setQuietMode(false);
    setSelectedListFilter('');
    setMainTakeover(undefined);
    setSelectedTable(undefined);
    setTableExpandAll(false);
    setGuestExpandAll(false);
    MAIN_TAKEOVER.homeRedirect && setMainTakeover(undefined);
  }

  useEffect(() => {
    onClickRedirect();
  }, [MAIN_TAKEOVER.homeRedirect]);
  return (<></>)
}