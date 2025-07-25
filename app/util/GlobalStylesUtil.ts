import { FeatureFlags, ID_1, ID_2, ID_3, ID_4, ID_5, ID_6, ID_7, ID_8 } from "~/config/AppState";

export const buttonRingRed = `hover:ring-red-600`;
export const buttonRingBlue = `hover:ring-blue-600`;
export const buttonRingGreen = `hover:ring-green-600`;
export const buttonRingWhite = `hover:ring-white`;
export const buttonHover = ``;
export const buttonHoverWhite = `${buttonHover} ${buttonRingWhite}`;
export const buttonHoverRed = `${buttonHover} ${buttonRingRed}`;
export const buttonHoverRing = `hover:ring-1 ${buttonHoverWhite}`;
export const buttonHoverRingRed = `hover:ring-1 ${buttonHoverRed}`;
export const buttonHoverRing2 = `hover:ring-2 ${buttonHoverWhite}`;
export const buttonHoverRingWhite = `${buttonRingWhite} ${buttonHover}`;
export const actionButtonStyles = `inline-flex text-gray-400 text-sm rounded-2xl ring-1 ring-gray-700 items-center justify-center px-4 ml-2 py-1 ${buttonHoverRing} hover:cursor-pointer`;
export const statusPillStyles = `inline-block px-2 py-1 rounded-full text-xs`;
export const formFieldStyles = `my-1 bg-transparent placeholder:text-slate-600 text-sm text-gray-300 border border-gray-800 rounded-md focus:cursor-text focus:outline-none focus:text-gray-300 hover:border-gray-300 hover:cursor-pointer placeholder:text-left text-left`;
export const formLabelTopStyles = `text-sm text-gray-400 ml-1 top-2 relative`;
export const formLabelLeftStyles = `text-sm text-gray-400 inline-block mr-1`;
export const formFieldStylesFullWidth = `w-full ${formFieldStyles}`;
export const formInputStyles =`h-[25px] px-1 ${formFieldStyles}`
export const formSelectStyles = `h-[35px] !p-1 ${formFieldStyles}`;
export const formInputStylesSmall =`w-[90px] ${formInputStyles}`;
export const formInputStylesExtraSmall =`w-[70px] ${formInputStyles}`;
export const optionStyles=`bg-black`;
export const dialogBackdropStyles = `fixed inset-0 bg-slate-500 bg-opacity-40 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in`;
export const actionIconStyles = `size-5 text-gray-600 hover:cursor-pointer hover:text-gray-300`;
export const ITEM = `mb-3 pb-3 pt-2 pl-2 border border-gray-800 rounded-lg`;
export const ROW = `flex items-center max-w-[295px]`;
export const INPUT_FIELD_100 = `w-[100px]`;
export const INPUT_FIELD_SM = `w-[90px]`;
export const INPUT_FIELD = `ml-2 w-[130px]`;
export const INPUT_FIELD_MED = `ml-2 w-[180px]`;
export const INPUT_FIELD_MED_LG = `ml-2 w-[215px]`;
export const INPUT_FIELD_LG = `ml-2 w-[230px]`;
export const INPUT_FIELD_SMALL = `ml-2 w-[40px]`;

export const partySizeStyles = `text-nowrap inline-block px-3 bg-gray-950 border border-gray-800 rounded-full`;
export const smallPartyStyle = `!bg-transparent !text-gray-400 !border-gray-800 ${partySizeStyles}`;
export const largePartyStyle1 = `!bg-gray-300 !text-black ${partySizeStyles}`;
export const largePartyStyle2 = `!bg-pink-700 !text-gray-200 ${partySizeStyles}`;
export const largePartyStyle3 = `!bg-emerald-700 !text-gray-200 ${partySizeStyles}`;
export const largePartyStyle4 = `!bg-amber-600 !text-gray-200 ${partySizeStyles}`;
export const largePartyStyle5 = `!bg-violet-600 !text-gray-200 ${partySizeStyles}`;
export const largePartyStyle6 = `!bg-fuchsia-600 !text-gray-200 ${partySizeStyles}`;
export const largePartyStyle7 = `!bg-cyan-500 !text-black ${partySizeStyles}`;
export const largePartyStyle8 = `!bg-gray-800 !text-gray-200 ${partySizeStyles}`;

export const tableChipsStyle = `flex items-center text-nowrap justify-center rounded-full py-1 px-3 text-xs border border-green-800 text-green-600 font-bold`;
export const selectedTableChipStyle = `ring-2 ring-white`;

export const formColumnStyles = `COLUMN flex m-1`;
export const fieldStyles = `flex-1`;
export const labelStyles = `text-sm text-gray-400 mr-2`;
export const separatorBarStyles = `border-transparent border-t-gray-900 h-0`;

export const columnBorders = `${FeatureFlags.SHOW_MAIN_SWIMLANES && 'md:border border-gray-900 rounded-xl mx-auto md:mx-0'}`;
export const mainListSwimLaneHeader = `sticky bg-gray-900 top-[-1px] z-9 md:flex hidden border-b border-gray-950 p-2 text-lg items-center text-slate-400 rounded-t-xl`;
export const mainColumnStyles = `flex-1 text-center select-none min-w-[345px] max-w-[450px] ${columnBorders}`;
export const mainColumnContentStyles = `mt-3 px-1 md:px-2`;
export const columnItemListStyles = `flex flex-col gap-2`;

export const baseButtonStyles = `inline-flex items-center justify-center text-white py-1 px-5 mt-1 mb-2 ring-1 rounded-full hover:cursor-pointer`;
export const viewReservationsStyles = `${baseButtonStyles} text-sm ring-gray-500 text-yellow-500 hover:ring-1 hover:ring-white`;
export const reservationsDisabledStyles = `${baseButtonStyles} text-sm !ring-gray-800 !text-gray-700 hover:!cursor-default`;

export const largePartyStylesOptions = [
  {
    id: ID_1,
    name: 'White',
    style: largePartyStyle1,
  },
  {
    id: ID_2,
    name: 'Red',
    style: largePartyStyle2,
  },
  {
    id: ID_3,
    name: 'Emerald',
    style: largePartyStyle3,
  },
  {
    id: ID_4,
    name: 'Amber',
    style: largePartyStyle4,
  },
  {
    id: ID_5,
    name: 'Violet',
    style: largePartyStyle5,
  },
  {
    id: ID_6,
    name: 'Fuchsia',
    style: largePartyStyle6,
  },
  {
    id: ID_7,
    name: 'Cyan',
    style: largePartyStyle7,
  },
  {
    id: ID_8,
    name: 'Gray',
    style: largePartyStyle8,
  }
];

export const GLOBAL_ZOOM = {zoom: '110%'};
export const ADMIN_SECTION_SCROLL_MARGIN_TOP = {scrollMarginTop: '100px'};
