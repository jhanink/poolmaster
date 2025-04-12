import type { TimeElapsed } from "~/util/Helpers";

export const durationSquareStyles = `flex flex-grow-0 px-2 items-center justify-end text-sm whitespace-nowrap`;

export const fragmentElapsedTime = (timeElapsed: TimeElapsed, isAssigned: boolean, style: string = durationSquareStyles) => {
  return (
    <>
      {timeElapsed.hours < 1 && ( // Less than 1 hour
        <div className={`${style} whitespace-nowrap text-gray-500`}>
          {timeElapsed.minutes} <span className="ml-1 text-gray-300">min</span>
        </div>
      )}
      {timeElapsed.hours >= 1 && ( // Less than 1 hour
        <div className={`${style} whitespace-nowrap text-gray-500`}>
          {timeElapsed.durationHoursDecimal} <span className={`ml-1 ${isAssigned?'text-green-600':'text-blue-600'}`}>hrs</span>
        </div>
      )}
    </>
  )
}

export const fragmentElapsedTimeFormatted = (hours: number, minutes: number, style: string = durationSquareStyles) => {
  return (
    <div className={`${style} text-nowrap text-gray-400`}>
      {!!hours  && `${hours}`}
      {!!hours && (<span className="text-gray-600">h :&nbsp;</span>)}
      {minutes}
      <span className="text-gray-600">m</span>
    </div>
  )
}
