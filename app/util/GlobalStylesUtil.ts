
export const buttonRingRed = `hover:ring-red-600`;
export const buttonRingBlue = `hover:ring-blue-600`;
export const buttonRingGreen = `hover:ring-green-600`;
export const buttonRingWhite = `hover:ring-white`;
export const buttonHover = `hover:border-transparent`;
export const buttonHoverWhite = `${buttonHover} ${buttonRingWhite}`;
export const buttonHoverRing = `hover:ring-1 ${buttonHoverWhite}`;
export const buttonHoverRing2 = `hover:ring-2 ${buttonHoverWhite}`;
export const buttonHoverRingWhite = `${buttonRingWhite} ${buttonHover}`;
export const actionButtonStyles = `inline-flex items-center text-gray-400 font-semibold text-sm rounded-2xl border border-gray-600 px-4 py-2 ml-3 ${buttonHoverRing} hover:cursor-pointer`;
export const statusPillStyles = `inline-block px-2 py-1 rounded-full text-xs`;
export const formFieldStyles = `px-3 py-2 w-full mt-1 bg-transparent placeholder:text-slate-600 text-sm text-gray-300 border border-gray-800 rounded-md focus:cursor-text focus:outline-none focus:border-gray-100 focus:text-gray-300 hover:border-gray-300 hover:cursor-pointer placeholder:text-left text-left`;
export const optionStyles=`bg-black`;
export const dialogBackdropStyles = `fixed inset-0 bg-slate-500 bg-opacity-40 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in`;