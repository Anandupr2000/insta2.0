import { faker } from '@faker-js/faker';
import React, { useEffect, useState } from 'react'

function Suggest() {
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    const suggestions = [...Array(5)].map((_, i) => (
      {
        username: faker.name.findName(),
        avatar: faker.image.avatar(),
        id: i
      }
    ))
    setSuggestions(suggestions)
  }, []);
  return (
    <div>
      <div className='flex justify-between'>
        <p className='text-sm text-gray-400 font-bold'>Suggestions for you</p>
        <button className='text-gray-600 font-semibold'>See All</button>
      </div>
      {
        suggestions.map(profile => (
          <div key={profile.id}
            className="flex space-x-4 items-center justify-between mt-3">
            <img className="w-10 h-10 rounded-full" src={profile.avatar} alt="" />
            <p className='flex-1 truncate'>{profile.username}</p>
            <button className='text-sm text-blue-400'>Follow</button>
          </div>
        ))
      }
    </div>
  )
}

export default Suggest