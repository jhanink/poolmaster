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
      <div className="mt-2 mb-10 border border-fuchsia-500 border-solid opacity-[.9] rounded-xl pt-1 px-2 inline-block min-w-[300px]">
        <div className="text-fuchsia-500 uppercase text-xl italic">
          Add Guest
        </div>
        <GuestForm guest={DefaultGuestData}></GuestForm>
      </div>
    </div>
  );
}
