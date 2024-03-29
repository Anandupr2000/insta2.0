import Image from 'next/image'
import React, { useState } from 'react'

import {
    SearchIcon,
    PlusCircleIcon,
    UserGroupIcon,
    HeartIcon,
    MenuIcon,
    CameraIcon
} from '@heroicons/react/outline'
import { HomeIcon } from '@heroicons/react/solid'
import { ExploreIcon, MessengerIcon } from "../images/Icons"
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRecoilState } from "recoil"
import { modalState } from '../atom/modalAtom'

function Header() {
    const [open, setOpen] = useRecoilState(modalState)

    // read only
    // const open = useRecoilState(modalState)
    const { data: session, status } = useSession()
    const router = useRouter()

    const [imageUrl, setImageUrl] = useState('data:image/jpeg;base64,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');
    return (
        <div className='header'>
            <div className="flex justify-between h-14 pl-5 pr-5 space-x-6 sm:mx-auto lg:ml-24 lg:mr-24">
                {/* left */}
                {/* cameraicon for smaller screen */}
                {/* flex-shrink-0 for preventing logo from shrinking */}
                <div className="relative sm:hidden w-8 flex-shrink-0 self-center cursor-pointer">
                    {/* <Image src="https://links.papareact.com/jjm"
                        layout='fill' objectFit='contain' alt={"Insta logo"} /> */}
                    <CameraIcon className='stroke-[.7] m-auto' />
                </div>
                {/* image for larger screen */}
                <div className='relative mt-1 p-3 w-28 rounded-md cursor-pointer'
                    onClick={() => router.push('/')}>
                    <Image src="https://links.papareact.com/ocw"
                        layout='fill' objectFit='contain' alt={"Insta logo"} />
                </div>
                {/* middle */}
                <div onClick={() => router.push('/')} className="relative flex-1 my-auto mx-auto hidden max-w-sm sm:inline-grid cursor-pointer">
                    <div className='absolute inset-y-0 pl-3 flex items-center'>
                        <SearchIcon className="h-4 w-4 text-gray-500" />
                    </div>

                    {/* imported tailwindcss forms for overriding basic html form elements */}
                    <input className="pl-10 block min-w-full bg-gray-50
                                sm:text-sm border-gray-300 focus:ring-gray-400 
                                focus:border-black rounded-md"
                        type="text" placeholder='search...' />
                </div>
                {/* right */}
                <div className='flex space-x-3 items-baseline items-center'>
                    <HomeIcon onClick={() => router.push('/')} className='navBtn navMenuItems' />
                    <MenuIcon className='navBtn navMenu' />
                    {
                        session ?
                            <>
                                <div className="relative navBtn navMenuItems">
                                    <MessengerIcon />
                                    <div className="notification">3</div>
                                </div>
                                <ExploreIcon className='navBtn navMenuItems' />
                                <PlusCircleIcon className='navBtn navMenuItems' onClick={() => setOpen(true)} />
                                <UserGroupIcon className="navBtn navMenuItems" />
                                <HeartIcon className="navBtn navMenuItems" />

                                <img src={session.user.image} onClick={signOut}
                                    className='w-7 h-7 my-auto rounded-full cursor-pointer' alt="avatar" />
                            </>
                            :
                            // <Link href="/auth/signin">
                            //     <a>Sign In</a>
                            // </Link>
                            <button className='navBtn' onClick={signIn}>Sign In</button>
                    }
                </div>

            </div>
        </div>
    )
}

export default Header