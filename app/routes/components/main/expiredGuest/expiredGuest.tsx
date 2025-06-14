import { useAtom } from "jotai";
import { appStateAtom, isSavingAtom } from "~/appStateGlobal/atoms";
import type { Guest } from "~/config/AppState";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles } from "~/util/GlobalStylesUtil";
import dayjs from "dayjs";
import { Helpers } from "~/util/Helpers";

export default function ExpiredGuest(props: {
  guest: Guest,
}) {
  const [, setAppState] = useAtom(appStateAtom);
  const [SAVING, setSaving] = useAtom(isSavingAtom);
  const CREATED_AT = dayjs(props.guest.createdAt).format('MMM D, h:mm a');
  const HOURS_AGO = Helpers.timeElapsedGuest(props.guest).hours;
  const hiliteColor = 'text-gray-400 font-bold';

  return (<>
    <div className={``}>
      <div className={`my-3 text-gray-500`}>
        <div className="text-sm mb-2">
          <span className="text-lg text-gray-500 uppercase">Expired</span>
        </div>
        <div className="italic text-sm">
          <span className={`${hiliteColor} uppercase`}>{props.guest.name}</span> was added <span className={`${hiliteColor}`}>{HOURS_AGO}</span> hours ago
        </div>
        <div className="italic text-sm mb-5">
          on <span className={`${hiliteColor} uppercase`}>{CREATED_AT}</span>
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
          Remove
        </button>
      </div>
    </div>
  </>)
}
