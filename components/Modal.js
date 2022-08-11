import React, { Fragment, useRef, useState } from 'react'
import { constSelector, useRecoilState } from "recoil"
import { modalState } from '../atom/modalAtom'
import { Transition, Dialog } from "@headlessui/react"
import { CameraIcon } from '@heroicons/react/outline'
import { useSession} from "next-auth/react"
import { addDoc, collection, doc, serverTimestamp, updateDoc , } from "firebase/firestore"
import { db, storage } from "../config/firebase"
import { getDownloadURL, ref, uploadBytesResumable, uploadString } from 'firebase/storage'

function Modal() {
  const filePickerRef = useRef(null)
  const captionRef = useRef(null)
  const {data:session} = useSession()

  const [open, setOpen] = useRecoilState(modalState)
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const addImageToPost = (e) => {
    const reader = new FileReader()
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0])

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result)
    }
  }

  const uploadPost = async () => {
    if (loading) return;
    setLoading(true)
    // 1 - create post
    // 2 - getting post id 
    // 3 - upload the image to firestore with id
    // 4 - get downloadUrl and update the original post
    const docRef = await addDoc(collection(db,"posts"),{
      usr:session.user.username,
      cap:captionRef.current.value,
      profileImg:session.user.image,
      timestamp:serverTimestamp()
    })

    console.log(`doc added with id : ${docRef.id}`)

    const imageRef = ref(storage,`images/${docRef.id}`)
    
    await uploadString(imageRef,selectedFile,"data_url").then(
      async snapshot=>{
        const downloadUrl = await getDownloadURL(imageRef)
        console.log(downloadUrl)
        await updateDoc(doc(db,"posts",docRef.id),{
          img:downloadUrl
        })
      })
      setLoading(false)
      setOpen(false)
      setSelectedFile(null)
      console.log("Upload succeeded")
  }

  return (
    // <div>
    //   {
    //     open && <p>Modal open</p>
    //   }

    // </div>
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}>
        <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-28 
        text-center sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <span
            className='hidden sm:inline-block sm:align-middle sm:h-screen'
            aria-hidden="true">
            &#8203;
          </span>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-4 sm:translate-0 sm:scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 sm:scale-95 translate-4 sm:translate-0"
              >
                <Dialog.Panel className="inline-flex flex-col space-y-3 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 
                text-left shadow-xl transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">

                  {
                    selectedFile ? (
                      <input
                        type="image"
                        className='w-full object-contain cursor-pointer'
                        src={selectedFile}
                        onClick={() => setSelectedFile(null)}
                        alt="preview" />
                    ) : (
                      // this div act as file picker instead of traditional one 
                      <div
                        onClick={() => filePickerRef.current.click()}
                        className="flex mx-auto items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer">
                        <CameraIcon className='h-6 w-6 text-red-600 '
                          aria-hidden="true" />
                      </div>
                    )
                  }
                  <Dialog.Title
                    as="h3"
                    className="mx-auto text-lg font-medium leading-6 text-gray-900"
                  >
                    Add a photo
                  </Dialog.Title>
                  <div className="mx-auto">
                    <input
                      ref={filePickerRef}
                      type="file"
                      name=""
                      id=""
                      onChange={addImageToPost}
                      hidden />
                  </div>
                  <div className="mx-auto">
                    <input
                      type="text"
                      name=""
                      id=""
                      ref={captionRef}
                      placeholder="Enter a caption"
                      className='userInp'
                    />
                  </div>
                    <div className="mt-5 sm:mt-6">
                      <button
                        type="button"
                        disabled={!selectedFile}
                        className="inline-flex justify-center w-full rounded-md border border-transparent bg-red-600 px-4 py-2 
                      shadow-sm text-base sm:text-sm font-medium text-white hover:bg-red-700 focus:outline-none 
                      focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        onClick={uploadPost}
                      >
                        Upload
                      </button>
                    </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Modal