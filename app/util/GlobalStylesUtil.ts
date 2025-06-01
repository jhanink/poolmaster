import { ID_1, ID_2, ID_3, ID_4, ID_5 } from "~/config/AppState";

export const buttonRingRed = `hover:ring-red-600`;
export const buttonRingBlue = `hover:ring-blue-600`;
export const buttonRingGreen = `hover:ring-green-600`;
export const buttonRingWhite = `hover:ring-white`;
export const buttonHover = `hover:border-transparent`;
export const buttonHoverWhite = `${buttonHover} ${buttonRingWhite}`;
export const buttonHoverRed = `${buttonHover} ${buttonRingRed}`;
export const buttonHoverRing = `hover:ring-1 ${buttonHoverWhite}`;
export const buttonHoverRingRed = `hover:ring-1 ${buttonHoverRed}`;
export const buttonHoverRing2 = `hover:ring-2 ${buttonHoverWhite}`;
export const buttonHoverRingWhite = `${buttonRingWhite} ${buttonHover}`;
export const actionButtonStyles = `inline-flex text-gray-400 text-sm rounded-2xl border border-gray-600 items-center justify-center px-4 py-1 mx-2 ${buttonHoverRing} hover:cursor-pointer`;
export const statusPillStyles = `inline-block px-2 py-1 rounded-full text-xs`;
export const formFieldStyles = `px-2 my-1 bg-transparent placeholder:text-slate-600 text-sm text-gray-300 border border-gray-800 rounded-md focus:cursor-text focus:outline-none focus:border-gray-100 focus:text-gray-300 hover:border-gray-300 hover:cursor-pointer placeholder:text-left text-left`;
export const formLabelTopStyles = `text-sm text-gray-400 ml-1 top-2 relative`;
export const formLabelLeftStyles = `text-sm text-gray-400 inline-block mr-1`;
export const formFieldStylesFullWidth = `w-full ${formFieldStyles}`;
export const formInputStyles =`h-[25px] ${formFieldStyles}`
export const formSelectStyles = `h-[35px] !p-1 ${formFieldStyles}`;
export const formInputStylesSmall =`w-[90px] ${formInputStyles}`;
export const formInputStylesExtraSmall =`w-[70px] ${formInputStyles}`;
export const optionStyles=`bg-black`;
export const dialogBackdropStyles = `fixed inset-0 bg-slate-500 bg-opacity-40 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in`;
export const actionIconStyles = `size-5 text-gray-600 hover:cursor-pointer hover:text-gray-300`;
export const ITEM = `mb-3 border border-gray-800 rounded-lg p-3`;
export const ROW = `flex items-center`;
export const ROW_PX_3 = `flex items-center px-3`;
export const INPUT_FIELD = `ml-2 w-[150px]`;

export const usageTypeIndicatorStyles = `text-sm text-nowrap inline-block px-3 bg-gray-950 border border-gray-800 rounded-full`;
export const smallPartyStyle = `!bg-transparent !text-gray-400 !border-gray-800 ${usageTypeIndicatorStyles}`;
export const largePartyStyle1 = `!bg-gray-300 !text-black font-bold ${usageTypeIndicatorStyles}`;
export const largePartyStyle2 = `!bg-pink-700 !text-gray-100 ${usageTypeIndicatorStyles}`;
export const largePartyStyle3 = `!bg-emerald-700 !text-gray-100 ${usageTypeIndicatorStyles}`;
export const largePartyStyle4 = `!bg-amber-600 !text-gray-100 ${usageTypeIndicatorStyles}`;
export const largePartyStyle5 = `!bg-violet-600 !text-gray-100 ${usageTypeIndicatorStyles}`;

export const headerStyles = `relative text-center select-none mt-2 mb-1 mx-2 py-1 text-nowrap text-lg text-slate-400 rounded-full bg-gray-900`;
export const footerStyles = `${headerStyles} flex items-center justify-center !text-xs top-1 mb-3`;

export const largePartyStylesOptions = [
  {
    id: ID_1,
    name: 'Style 1 (White)',
    style: largePartyStyle1,
  },
  {
    id: ID_2,
    name: 'Style 2 (Red)',
    style: largePartyStyle2,
  },
  {
    id: ID_3,
    name: 'Style 3 (Emerald)',
    style: largePartyStyle3,
  },
  {
    id: ID_4,
    name: 'Style 4 (Amber)',
    style: largePartyStyle4,
  },
  {
    id: ID_5,
    name: 'Style 5 (Violet)',
    style: largePartyStyle5,
  }
];
