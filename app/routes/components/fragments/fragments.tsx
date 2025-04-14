import type { TimeElapsed } from "~/util/Helpers";

export const durationSquareStyles = `flex flex-grow-0 px-2 items-center justify-end text-sm whitespace-nowrap`;

export const fragmentElapsedTime = (timeElapsed: TimeElapsed, isAssigned: boolean, style: string = durationSquareStyles) => {
  return (
    <>
      {timeElapsed.hours < 1 && ( // under 1 hour - show minutes
        <div className={`whitespace-nowrap text-gray-500 ${style}`}>
          {timeElapsed.minutes} &nbsp;<span className="text-gray-300">min</span>
        </div>
      )}
      {timeElapsed.hours >= 1 && ( // over 1 hour - display decimal hours
        <div className={`whitespace-nowrap text-gray-500 ${style}`}>
          {timeElapsed.durationHoursDecimal} &nbsp;<span className={`${isAssigned?'text-green-600':'text-blue-500'}`}>hrs</span>
        </div>
      )}
    </>
  )
}

export const fragmentElapsedTimeFormatted = (hours: number, minutes: number, style: string = durationSquareStyles) => {
  return (
    <div className={`text-nowrap text-gray-400 ${style}`}>
      {!!hours  && `${hours}`}
      {!!hours && (<span className="text-gray-600">h :&nbsp;</span>)}
      {minutes}
      <span className="text-gray-600">m</span>
    </div>
  )
}
