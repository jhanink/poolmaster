import { useAtom } from "jotai";
import { manageTablesAtom } from "~/appStateGlobal/atoms";

export default function ProfileMenu(props: {
  toggle: () => void;
}) {

  const [isManageTables, setManageTables] = useAtom(manageTablesAtom);

  const onClickManageTables = () => {
    setManageTables(!isManageTables);
    props.toggle();
  }

  return (
    <div className="flex justify-center bg-white rounded-xl relative z-90">
      <div
      className="w-full max-w-sm p-3 drop-shadow-xl divide-y divide-gray-200"
    >
      <div aria-label="header" className="flex space-x-4 items-center p-4">
        <div aria-label="avatar" className="flex mr-auto items-center space-x-4">
          <img
            src="./app/static/svb.png"
            alt="avatar SVB"
            className="w-16 h-16 shrink-0 rounded-full"
          />
          <div className="space-y-2 flex flex-col flex-1 truncate">
            <div className="font-medium relative text-xl leading-tight text-gray-900">
              <span className="flex">
                <span className="truncate relative pr-8">
                  SVB
                  <span
                    aria-label="verified"
                    className="absolute top-1/2 -translate-y-1/2 right-0 inline-block rounded-full"
                  >
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
        <svg onClick={props.toggle}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="w-6 h-6 text-gray-400 shrink-0 hover:cursor-pointer"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M8 9l4 -4l4 4"></path>
          <path d="M16 15l-4 4l-4 -4"></path>
        </svg>
      </div>
      <div aria-label="navigation" className="py-2">
        <nav className="">
          <a
            href="/"
            className="flex items-center leading-6 space-x-3 py-3 px-4 w-full text-lg text-gray-600 focus:outline-none hover:bg-gray-100 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-7 h-7"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
              <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
            </svg>
            <span>Account</span>
          </a>
          <a
            href="/"
            className="flex items-center leading-6 space-x-3 py-3 px-4 w-full text-lg text-gray-600 focus:outline-none hover:bg-gray-100 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-7 h-7"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M9.785 6l8.215 8.215l-2.054 2.054a5.81 5.81 0 1 1 -8.215 -8.215l2.054 -2.054z"
              ></path>
              <path d="M4 20l3.5 -3.5"></path>
              <path d="M15 4l-3.5 3.5"></path>
              <path d="M20 9l-3.5 3.5"></path>
            </svg>
            <span>Integrations</span>
          </a>
          <a
            href="/"
            className="flex items-center leading-6 space-x-3 py-3 px-4 w-full text-lg text-gray-600 focus:outline-none hover:bg-gray-100 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-7 h-7"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"
              ></path>
              <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
            </svg>
            <span>Settings</span>
          </a>
          <div
            onClick={onClickManageTables}
            className="flex items-center leading-6 space-x-3 py-3 px-4 w-full text-lg text-gray-600 focus:outline-none hover:bg-gray-100 rounded-md hover:cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-7 h-7"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z"
              ></path>
              <path d="M12 16v.01"></path>
              <path
                d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483"
              ></path>
            </svg>
            <span>Manage Tables</span>
          </div>
        </nav>
      </div>
      <div aria-label="account-upgrade" className="px-4 py-6">
        <div className="flex items-center space-x-3">
          <div className="mr-auto space-y-2">
            <p className="font-medium text-xl text-gray-900 leading-none">
              Free Plan
            </p>
          </div>
          <button
            type="button"
            className="inline-flex px-6 leading-6 py-3 rounded-md bg-indigo-50 hover:bg-indigo-50/80 transition-colors duration-200 text-indigo-500 font-medium text-lg"
          >
            Upgrade
          </button>
        </div>
      </div>
      <div aria-label="footer" className="pt-2">
        <button
          type="button"
          className="flex items-center space-x-3 py-3 px-4 w-full leading-6 text-lg text-gray-600 focus:outline-none hover:bg-gray-100 rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="w-7 h-7"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
            ></path>
            <path d="M9 12h12l-3 -3"></path>
            <path d="M18 15l3 -3"></path>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>
  )
}