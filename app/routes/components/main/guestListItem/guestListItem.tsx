import GuestItem from "../guestItem/guestItem";
import { type Guest } from "~/config/AppState";
import { useState, useRef, useEffect } from "react";
import { useDrag } from 'react-dnd';
import { ListFilterTypeEnum, selectedListFilterAtom } from "~/appStateGlobal/atoms";
import { useAtom } from "jotai";

export default function GuestListItem(props: {
  guest: Guest,
  index: number,
}) {
  const [ITEM_EXPANDED, setItemExpanded] = useState(false);
  const [ITEM_EDITING, setItemEditing] = useState(false);
  const [SELECTED_LIST_FILTER] = useAtom(selectedListFilterAtom);

  const dragRef = useRef<HTMLDivElement>(null);
  const canDragRef = useRef(true);

  const [draggable, drag, dragPreview] = useDrag(() => ({
    type: 'GUEST_ITEM', // A unique string to identify the type of draggable item.  IMPORTANT!
    item: { guest: props.guest }, // Data you want to associate with the dragged item.
    canDrag: () => canDragRef.current, // Whether the item is draggable
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // Get drag state (e.g., for styling)
    }),
    end: (item, monitor) => {
      // You can do something here after dragging has finished, before drop.
      // Often, you'll handle more in the drop target's `drop` method.
    },
  }));

  useEffect(() => {
    canDragRef.current = !ITEM_EDITING; // Disable dragging when editing
  }, [ITEM_EDITING]);

  useEffect(() => {
    switch (SELECTED_LIST_FILTER) {
      case (ListFilterTypeEnum.WAITLIST):
        setItemExpanded(true);
        break;
      default:
        setItemExpanded(false);
    }
  }, [SELECTED_LIST_FILTER]);

  drag(dragRef); // Attach drag behavior to the element
  dragPreview(dragRef); // Use the same element as the drag preview

  return <>
    <div ref={dragRef}
        className={`${draggable.isDragging ? `opacity-0`:`opacity-90`} hover:cursor-pointer select-none mb-4`}
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
  </>
}
