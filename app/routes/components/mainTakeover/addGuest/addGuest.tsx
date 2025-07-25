import { DefaultGuestData } from "~/config/AppState";
import GuestForm from "../../main/guestForm/guestForm";
import { fragmentExitTakeover } from "../../fragments/fragments";
import { mainTakoverAtom } from "~/appStateGlobal/atoms";
import { useAtom } from "jotai";

export default function AddGuest() {
  const [, setMainTakeover] = useAtom(mainTakoverAtom);

  const exit = () => {
    setMainTakeover(undefined);
  }

  return (
    <div className="select-none flex-1 text-center relative items-center">
      {fragmentExitTakeover(exit)}
      <div className="mt-2 bg-transparent mb-10 border border-gray-800 rounded-xl pt-1 px-2 inline-block">
        <GuestForm guest={DefaultGuestData}></GuestForm>
      </div>
    </div>
  );
}
