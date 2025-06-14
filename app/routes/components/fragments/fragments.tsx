import type { TimeElapsed } from "~/util/Helpers";
import { CogIcon, ArrowRightIcon, ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import { DEFAULT_ID, type UsageType } from "~/config/AppState";

export const durationSquareStyles = `flex flex-grow-0 px-2 items-center justify-end text-sm text-nowrap`;

export const fragmentElapsedTime = (timeElapsed: TimeElapsed, isAssigned: boolean, style: string = durationSquareStyles) => {
  return (
    <>
      {timeElapsed.hours < 1 && ( // under 1 hour - show minutes
        <div className={`text-nowrap text-gray-500 ${style}`}>
          {timeElapsed.minutes} &nbsp;<span className="text-gray-300">min</span>
        </div>
      )}
      {timeElapsed.hours >= 1 && ( // over 1 hour - display decimal hours
        <div className={`text-nowrap text-gray-500 ${style}`}>
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
      <span className="text-rose-500">MASTER</span>
    </div>
  )
}

export const fragmentExitTakeover = (closeCallbackFn: () => void) => {
  return (
    <div className="flex items-center justify-center CLOSE_BUTTON w-full pr-2 pt-2 pb-2 sticky top-0 bg-black z-10">
      <div className="inline-block hover:cursor-pointer text-gray-500 hover:text-gray-300" onClick={closeCallbackFn}>
        <ArrowsPointingInIcon className="mr-3 inline-block size-6"></ArrowsPointingInIcon>
        <span className="relative top-[3px] text-xl">EXIT</span>
      </div>
    </div>
  )
}

export const fragmentWelcomeMessage = () => {
  const messages = [
    'Guest Wait List with elapsed time',
    'Drag-N-Drop for table assignment',
    'Table closeout with automatic rate calculator',
    'Wait List and Table List stats and filters',
    'Guest details name, phone number, and notes',
    'Admin management for tables, table types, and rates',
    'Works on desktop and mobile devices',
    'Realtime sync for all connected screens',
  ];
  return (
    <div className="border m-3 p-10 w-full text-gray-500 text-sm rounded-xl border-gray-700">
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
          {messages.map((message, index) => (
            <li key={index}><span className="text-gray-500 mr-3"> <ArrowRightIcon className="inline-block size-5"></ArrowRightIcon> </span><span>{message}</span></li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export const fragmentUsageIndicator = (usageType: UsageType) => {
  const icon = usageType.useIcon && usageType.icon;
  const iconOnly = usageType.iconOnly;
  return (<>
    {(usageType.id !== DEFAULT_ID) && (<>
      <div className="text-sm">
        <div className={`inline-block px-2 border rounded-xl border-gray-700`}>
          {(!icon || !iconOnly) && (
            <span className={`text-gray-400 ${icon?'mr-2 relative top-[-2px]':''}`} style={{color: usageType.textColor}}>{usageType.name}</span>
          )}
          {!!icon && (
            <span className="top-[1px] relative text-lg">{icon}</span>
          )}
        </div>
      </div>
    </>)}
  </>)
}
