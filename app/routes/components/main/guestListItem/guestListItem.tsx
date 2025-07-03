import GuestItem from "../guestItem/guestItem";
import { GuestItemTypeKey, type Guest } from "~/config/AppState";
import { useState, useRef, useEffect } from "react";
import { useDrag } from 'react-dnd';
import { guestExpandAllAtom} from "~/appStateGlobal/atoms";
import { useAtom } from "jotai";
import { Helpers } from "~/util/Helpers";
import ExpiredVisit from "../expiredVisit/expiredVisit";

export default function GuestListItem(props: {
  guest: Guest,
  index: number,
}) {
  const [ITEM_EXPANDED, setItemExpanded] = useState(false);
  const [ITEM_EDITING, setItemEditing] = useState(false);
  const [GUEST_EXPAND_ALL] = useAtom(guestExpandAllAtom);

  const dragRef = useRef<HTMLDivElement>(null);
  const canDragRef = useRef(true);

  const [draggable, drag, dragPreview] = useDrag(() => ({
    type: GuestItemTypeKey,
    item: { guest: props.guest },
    canDrag: () => canDragRef.current,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      // You can do something here after dragging has finished, before drop.
      // Often, you'll handle more in the drop target's `drop` method.
    },
  }));

  useEffect(() => {
    canDragRef.current = !ITEM_EDITING;
  }, [ITEM_EDITING]);

  useEffect(() => {
    const expand = GUEST_EXPAND_ALL;
    setItemExpanded(expand);
}, [GUEST_EXPAND_ALL]);

  drag(dragRef);
  dragPreview(dragRef);

  const IS_EXPIRED = Helpers.isExpiredVisit(props.guest);

  return <>
    <div className="select-none">
      {IS_EXPIRED ? (
        <div className="text-center border border-gray-800 border-dashed rounded-xl">
          <ExpiredVisit guest={props.guest} />
        </div>
      ) : (
        <div ref={dragRef}
          className={`${draggable.isDragging ? `opacity-0`:`opacity-90`} hover:cursor-pointer`}
          style={{transition: 'opacity .35s'}}
          >
          <GuestItem
            guest={props.guest}
            key={props.guest.id}
            index={props.index}
            isAssigned={false}
            itemExpanded={ITEM_EXPANDED}
            setItemExpanded={setItemExpanded}
            setItemEditing={setItemEditing}>
          </GuestItem>
        </div>
      )}
    </div>
  </>
}
