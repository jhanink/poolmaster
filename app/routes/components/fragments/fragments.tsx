import type { JSX } from "react";
import { Helpers, type TimeElapsed } from "~/util/Helpers";
import { ArrowRightIcon, ArrowUturnLeftIcon} from "@heroicons/react/24/outline";
import { DEFAULT_ID, type AdminSettings, type Guest, type UsageType } from "~/config/AppState";
import { largePartyStylesOptions, separatorBarStyles } from "~/util/GlobalStylesUtil";

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

export const fragmentExitTakeover = (closeCallbackFn: () => void, fragmentCallbackFn?: () => JSX.Element) => {
  return (<>
    <div className="sticky top-0 bg-black z-10 pt-2 w-full">
      <div className="flex items-center justify-center CLOSE_BUTTON pb-4">
        <div className="flex items-center hover:cursor-pointer text-gray-500 hover:text-gray-100" onClick={closeCallbackFn}>
          <ArrowUturnLeftIcon className="mr-2 size-6"></ArrowUturnLeftIcon>
          <span className="text-xl">BACK</span>
        </div>
      </div>
      <hr className={`${separatorBarStyles}`}/>
      {fragmentCallbackFn && fragmentCallbackFn()}
    </div>
  </>)
}

export const fragmentWelcomeMessage = () => {
  const messages = [
    'Guest Wait List with elapsed time',
    'Guest details name, phone number, and notes',
    'Table List with elapsed time',
    'Table Assignment via Drag N Drop',
    'Wait List and Table List stats and filters',
    'Table closeout with automatic rate calculator',
    'Admin management to customize settings',
    'Works on desktop and mobile devices',
    'Realtime sync for all connected screens',
  ];
  return (
    <div className="inline-block m-3 py-5 px-10 text-gray-500 rounded-xl border border-gray-700">
      <div className="text-2xl mb-5 text-gray-100">
        Welcome to
        {fragmentAppName('text-xl ml-2')}
      </div>

      <div className="mt-5">
        <div className="text-xl mb-3 italic">
          notable features
        </div>
        <ul className="mt-5 text-gray-100 text-sm text-center">
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
      <div className="text-xs my-3">
        <div className={`inline-block px-2 border rounded-xl border-gray-700`}>
          <div className="flex items-center">
            {(!icon || !iconOnly) && (
              <div className={`text-gray-400 ${icon?'mr-2':''}`} style={{color: usageType.textColor}}>{usageType.name}</div>
            )}
            {!!icon && (
              <div className="text-base">{icon}</div>
            )}
          </div>
        </div>
      </div>
    </>)}
  </>)
}

export const fragmentGuestName = (settings: AdminSettings, guest: Guest) => {
  const partySize = guest.partySize;
  const isLargeParty = partySize >= settings.largePartySize;
  const largePartyStyle = `${largePartyStylesOptions[settings.largePartyStyle - 1].style}`;
  return (
    <div className={`grow uppercase text-left text-gray-200 truncate`}>
      <div className={`inline-block text-base ${isLargeParty ? `${largePartyStyle}`: ``}`}>
        {guest.name}
        {guest.partySize > 1 && (<>
          <span className={`${isLargeParty?'':'text-gray-500'}`}> : {guest.partySize}</span>
        </>)}
      </div>
    </div>
  )
}

export const fragmentDateStyled = (date: number, includeDay: boolean = true) => {
  return (<>
    <span className="text-gray-200">{Helpers.formatTime(date)}</span>
    {includeDay && (<>
      <span>, </span>
      <span className="text-gray-500">{Helpers.formatDay(date)}</span>
    </>)}
  </>)
}
