import React from 'react'
import Stories from './Stories/Stories'
import Posts from './Posts/Posts'
import Miniprofile from './Miniprofile'
import Suggest from './Suggest'
import { useSession } from 'next-auth/react'

function Feed() {
  const { data: session } = useSession()
  return (
    <main className={`grid grid-cols-1 lg:grid-cols-2 lg:max-w-3xl
    xl:grid-cols-3 xl:max-w-6xl mx-auto mt-4 pl-2 pr-2 sm:pl-8 sm:pr-8
    ${!session && "!grid-cols-1 !max-w-3xl"}`}>
      {/* <section className='w-28 h-28 bg-slate-500'> */}
      <section className='col-span-2'>
        {/* stories */}
        <Stories />
        {/* posts */}
        <Posts />
      </section>
      {/* <section className='w-28 h-28 bg-slate-300'> */}
      {
        session && (
          <section>
            <div className='hidden pl-6 lg:flex lg:flex-col lg:space-y-6 fixed top-30'>
              {/* miniprofile */}
              <Miniprofile />
              {/* suggestions */}
              <Suggest />
            </div>
          </section>
        )
      }
    </main>
  )
}

export default Feed