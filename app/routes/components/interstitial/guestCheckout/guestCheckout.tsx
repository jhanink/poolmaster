import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { appStateAtom, guestCheckoutAtom, selectedTableAtom } from "~/appStateGlobal/atoms";
import { AppStorage } from "~/util/AppStorage";
import { actionButtonStyles, formFieldStyles } from "~/util/GlobalStylesUtil";
import { Helpers, type TimeElapsed } from "~/util/Helpers";
import { fragmentElapsedTime } from "../../fragments/fragments";

export default function GuestCheckout() {
  const [, setAppState] = useAtom(appStateAtom);
  const [, setSelectedTable] = useAtom(selectedTableAtom);
  const [CHECKOUT_TABLE, setGuestCheckoutStarted] = useAtom(guestCheckoutAtom);
  const [DURATION, setDuration] = useState<TimeElapsed>({} as TimeElapsed);

  const onClickCheckoutItem = async () => {
    const newAppState = await AppStorage.deleteGuestRemote(CHECKOUT_TABLE.guest.id);
    setAppState(newAppState);
    setSelectedTable(undefined);
    setGuestCheckoutStarted(undefined);
  }

  const onChangeDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const durationHoursDecimal = event.target.value
    setDuration({
      ...DURATION,
      durationHoursDecimal
    });
  }

  const onClickCancelCheckout = () => {
    CHECKOUT_TABLE.guest.checkedOutAt = 0;
    setGuestCheckoutStarted(undefined);
  }

  const onClickReset  = () => {
    const start = CHECKOUT_TABLE.guest.assignedAt;
    const end = CHECKOUT_TABLE.guest.checkedOutAt;
    setDuration(Helpers.timeElapsed(start, end));
  }

  useEffect(() => {
    const start = CHECKOUT_TABLE.guest.assignedAt;
    const end = CHECKOUT_TABLE.guest.checkedOutAt;
    onClickReset()
  }, []);

  return (
    <div className="border-white select-none mt-5">
      <div className="flex-1 text-center">
        <div className="text-xl text-gray-400 mt-5">
          <div className="mb-3">
            Close Out <span className="text-green-600">{CHECKOUT_TABLE.name}</span>
          </div>
          <div className="mb-3 uppercase text-green-600">
            {CHECKOUT_TABLE.guest.name}
          </div>
          <div>
            {fragmentElapsedTime(DURATION, true, 'text-2xl inline-block')}
          </div>
        </div>
        <div className="border border-gray-900 p-5 m-5 text-gray-500">
          <div className="TIME flex items-center">
            <div className="mr-2">
              Total Time (hrs)
            </div>
            <div className="inline-block">
              {DURATION && (
                <input
                type="text"
                  className={formFieldStyles}
                  onChange={onChangeDuration}
                  value={`${DURATION.durationHoursDecimal}`}
                />
              )}

            </div>
          </div>

          {CHECKOUT_TABLE.guest.extraPlayers.map((player, index) => (
            <div key={index} className="text-gray-500">
              {player.name}
            </div>
          ))}

        </div>

        <div className="my-3">
          <button className={`${actionButtonStyles} mx-2`} onClick={onClickCancelCheckout}>Cancel</button>
          <button className={`${actionButtonStyles} mx-2`} onClick={onClickReset}>Reset</button>
          <button className={`${actionButtonStyles} mx-2`} onClick={onClickCheckoutItem}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
