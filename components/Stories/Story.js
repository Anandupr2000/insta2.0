import React from 'react'

function Story({ img, username }) {
  return (
    <div>
      <div className='avatar story'>
        <img src={img} className="avatarImg" alt="userStory" />
      </div>
      <p className='text-xs w-14 truncate text-center'>{username}</p>
    </div>
  )
}

export default Story