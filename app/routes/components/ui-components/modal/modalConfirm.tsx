import React, { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { actionButtonStyles, dialogBackdropStyles } from '~/util/GlobalStylesUtil';
import { useAtom } from 'jotai';
import { isSavingAtom } from '~/appStateGlobal/atoms';

const dialogPanelStyles=`text-sm relative transform overflow-hidden rounded-lg bg-black text-gray-200 px-10 pr-14 py-8 sm:my-8 p-6 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95`;
const exclamationTriangleIconStyles = `mx-auto flex shrink-0 items-center justify-center rounded-full font-bold sm:mx-0 sm:size-10`;

export default function ModalConfirm(props: {
  show: boolean,
  dialogTitle: string,
  dialogMessageFn: () => React.ReactNode,
  onConfirm: () => void,
  onCancel: () => void,
}) {
  const [SAVING] = useAtom(isSavingAtom);
  const [OPEN] = useState(true);

  return (<>
    {props.show && (
    <Dialog open={OPEN} onClose={props.onCancel} className="relative z-10">
      <DialogBackdrop transition className={`${dialogBackdropStyles}`}/>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel transition className={`${dialogPanelStyles}`}>
            <div className="flex">
              <div className="flex-0 mx-2 align-center justify-center">
                <div className={`${exclamationTriangleIconStyles}`}>
                  <ExclamationTriangleIcon aria-hidden="true" className="size-8 fill-transparent" />
                </div>
              </div>
              <div className="flex-1">
                <div className="ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h2" className="text-gray-100">
                    {props.dialogTitle}
                  </DialogTitle>
                  <div className="mt-2">
                    <div className="text-sm text-gray-200">
                      {props.dialogMessageFn()}
                    </div>
                  </div>
                </div>
                <div className=" mt-5 text-center">
                  <button type="button" onClick={() => {props.onCancel(); }} className={actionButtonStyles}>
                    Cancel
                  </button>
                  <button
                    disabled={SAVING}
                    type="button" onClick={() => {props.onConfirm(); }} className={actionButtonStyles}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
    )}
  </>)
}
