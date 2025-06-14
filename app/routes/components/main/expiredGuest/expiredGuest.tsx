import { useAtom } from "jotai";
import { appStateAtom, isSavingAtom } from "~/appStateGlobal/atoms";
import type { Guest } from "~/config/AppState";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles } from "~/util/GlobalStylesUtil";
import dayjs from "dayjs";

export default function ExpiredGuest(props: {
  guest: Guest,
}) {
  const [, setAppState] = useAtom(appStateAtom);
  const [SAVING, setSaving] = useAtom(isSavingAtom);
  const CREATED_AT = dayjs(props.guest.createdAt).format('MMM D - h:mm a');
  return (<>
    <div className={``}>
      <div className={`my-3 text-gray-500`}>
        <div className="text-sm mb-2">
          <span className="italic text-lg">Expired Guest</span>: <span className="text-cyan-500 uppercase ml-2">{props.guest.name}</span>
        </div>
        <div className="italic text-sm mb-5">
           Created: <span className="text-cyan-500 ml-2">{CREATED_AT}</span>
        </div>
      </div>
      <div className={'mb-3'}>
        <button className={`${actionButtonStyles}`}
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
