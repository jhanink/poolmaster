import { DefaultGuestData } from "~/config/AppState";
import GuestForm from "../../main/guestForm/guestForm";

export default function AddGuest() {
  return (
    <div className="select-none flex-1 text-center relative items-center">
      <div className="mt-5 mb-10 border border-yellow-500 border-solid opacity-[.9] rounded-xl p-5 inline-block min-w-[350px]">
        <div className="text-lg text-yellow-500 uppercase">
          Add Guest
        </div>
        <GuestForm guest={DefaultGuestData}></GuestForm>
      </div>
    </div>
  );
}
