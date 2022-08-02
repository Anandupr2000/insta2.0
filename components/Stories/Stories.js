import React, { useEffect, useState, useRef } from 'react'
import Story from './Story';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import fakeData from "../../fakeData/data"
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/outline'
import { useSession } from 'next-auth/react';

function Stories() {
  // const [items, setItems] = React.useState(getItems);
  const [selected, setSelected] = React.useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const { data: session } = useSession()

  const isItemSelected = (id) => !!selected.find((el) => el === id);

  const handleClick =
    (id) =>
      ({ getItemById, scrollToItem }) => {
        const itemSelected = isItemSelected(id);

        setSelected((currentSelected) =>
          itemSelected
            ? currentSelected.filter((el) => el !== id)
            : currentSelected.concat(id)
        );
      };

  useEffect(() => {
    var fakeData = require("../../fakeData/data").default
    console.log(fakeData)
    setSuggestions(fakeData)
    // return () => {    
    // };
  }, []);
  return (
    <div className='relative bg-white h-24
            border border-gray-300 rounded-lg '>
      <ScrollMenu scrollContainerClassName='flex p-3 space-x-1 overflow-x-hidden' LeftArrow={LeftArrow} RightArrow={RightArrow} >
        {
          session &&
          <Story key={session.user.uid} img={session.user.image} 
          username={session.user.username}/>
        }
        {
          suggestions.map(profile => (
            <Story key={profile.id}
              img={profile.avatar}
              username={profile.username} />
          ))
        }
      </ScrollMenu>
    </div>
  );
}

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } =
    React.useContext(VisibilityContext);
  return (
    <ChevronLeftIcon
      className={
        isFirstItemVisible ?
          "" : 'my-8 w-5 bg-white absolute z-10 rounded-full cursor-pointer'}
      disabled={isFirstItemVisible} onClick={() => scrollPrev()} />
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);
  return (
    <ChevronRightIcon
      className={
        isLastItemVisible ?
          "" : 'my-8 w-5 bg-white absolute z-10 rounded-full cursor-pointer right-0'
      } disabled={isLastItemVisible} onClick={() => scrollNext()} />
  );
}

export default Stories;
