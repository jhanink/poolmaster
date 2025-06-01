import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { mainTakoverAtom } from "~/appStateGlobal/atoms";
import { fragmentExitTakeover } from "../../fragments/fragments";
import GuestItem from "../../main/guestItem/guestItem";

export default function EditGuest() {
  const [MAIN_TAKEOVER, setMainTakeover] = useAtom(mainTakoverAtom);
  const guest = MAIN_TAKEOVER.editGuest;
  const TopRef = useRef<HTMLDivElement>(null);

  const exit = () => {
    setMainTakeover(undefined);
  }

  useEffect(() => {
    TopRef.current && TopRef.current.scrollIntoView();
  }, []);

  return (
    <div className="select-none flex-1 text-center relative items-center" ref={TopRef}>
      {fragmentExitTakeover(exit)}
      <div>
        <div className="CONTENT flex justify-center mx-5">
          <div>
            <GuestItem
              guest={guest}
              key={guest.id}
              index={0}
              isAssigned={!!guest.assignedAt}
              isEditForm={true}
              itemExpanded={true}
              setItemExpanded={undefined}
              setItemEditing={undefined}>
            </GuestItem>
          </div>
        </div>
      </div>
  </div>
  );
}
