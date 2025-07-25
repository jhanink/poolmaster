import { useAtom } from "jotai";
import { appStateAtom, isSavingAtom } from "~/appStateGlobal/atoms";
import type { Guest } from "~/config/AppState";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles } from "~/util/GlobalStylesUtil";
import { Helpers } from "~/util/Helpers";

export default function ExpiredVisit(props: {
  guest: Guest,
}) {
  const [, setAppState] = useAtom(appStateAtom);
  const [SAVING, setSaving] = useAtom(isSavingAtom);

  const WHEN = Helpers.formatDate(props.guest.assignedAt || props.guest.createdAt);
  const HOURS_AGO = props.guest.assignedAt ? Helpers.timeElapsedTable(props.guest).hours : Helpers.timeElapsedGuest(props.guest).hours;
  const hiliteColor = 'text-gray-400 font-bold';

  return (<>
    <div className={``}>
      <div className={`my-3 text-gray-500`}>
        <div className="italic text-sm">
          <span className={`${hiliteColor} uppercase`}>{props.guest.name}</span> was {props.guest.assignedAt ? 'assigned' : 'added'} <span className={`${hiliteColor}`}>{HOURS_AGO}</span> hours ago
        </div>
        <div className="italic text-sm mb-5">
          on <span className={`${hiliteColor} uppercase`}>{WHEN}</span>
        </div>
      </div>
      <div className={'mb-3'}>
        <button className={`${actionButtonStyles} !text-gray-500`}
          onClick={async () => {
            if (SAVING) return;
            setSaving(true);
            const newAppState = await AppStorage.deleteGuestRemote(props.guest.id);
            setSaving(false);
            setAppState(newAppState);
          }}>
          <span className="text-gray-500">Clear Expired Visit</span>
        </button>
      </div>
    </div>
  </>)
}
