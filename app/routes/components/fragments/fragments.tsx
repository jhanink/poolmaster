import type { TimeElapsed } from "~/util/Helpers";
import { CogIcon, ArrowRightIcon, ArrowsPointingInIcon } from "@heroicons/react/24/outline";

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

export const fragmentAppName = (style = '') => {
  return (
    <div className={`${style} inline-block text-gray-600`}>
      <span>POOLHALL</span>
      <span className="text-red-500">MASTER</span>
    </div>
  )
}

export const fragmentExitTakeover = (closeCallbackFn: () => void) => {
  return (
    <div className="flex items-center justify-end CLOSE_BUTTON w-full pr-2 pt-2 sticky top-0 bg-black z-10">
      <div className="inline-block hover:cursor-pointer text-gray-500 hover:text-gray-300" onClick={closeCallbackFn}>
        <ArrowsPointingInIcon className="mr-3 inline-block size-5"></ArrowsPointingInIcon>
        <span className="relative top-[1px] text-sm">EXIT</span>
      </div>
    </div>
  )
}

export const fragmentWelcomeMessage = () => {
  const messages = [
    'Guest Wait List with elapsed time',
    'Drag-N-Drop for table assignment',
    'Table closeout with time-billing totals',
    'Wait List and Table List filters',
    'Player Names, phone number, and notes',
    'Admin Console to manage tables and billing',
    'Works on Mobile and Desktop',
    'Realtime sync across devices and screens'
  ];
  return (
    <div className="border m-3 p-10 w-full text-gray-500 text-sm border rounded-xl border-gray-700">
      <div className="text-2xl mb-5 text-gray-100">
        Welcome to
        {fragmentAppName('text-xl ml-2')}
      </div>
      <div className="text-xl italic">
        Setup your pool room now
      </div>
      <div className="mt-5 text-gray-200">
        After you save something below, this message will go away.
        <p className="mb-3"/>
        You can return here anytime from within the app
        <p/>
        by clicking the gear icon
        <CogIcon className="inline-block mx-2 size-5 text-yellow-500"></CogIcon>
        at the bottom of the screen.
      </div>

      <div className="mt-5">
        <div className="text-2xl mb-3 text-gray-100">
          We hope you enjoy Pool Master
        </div>
        <div className="text-xl mb-3 italic">
          Here are a few notable features
        </div>
        <ul className="pl-10 mt-5 text-gray-100 text-base text-left">
          {messages.map((message) => (
            <li><span className="text-gray-500 mr-3"> <ArrowRightIcon className="inline-block size-5"></ArrowRightIcon> </span><span>{message}</span></li>
          ))}
        </ul>
      </div>
    </div>
  )
}
