import React, { useState } from 'react'
import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/outline'
import { CommentIcon } from '../../images/Icons';

function Post({ postId, username, avatar, caption, img }) {

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const postComment = (e) => {
    e.preventDefault();
    if (user) {
      console.log("comments => ")
      console.log(comments)
      addDoc(collection(db, `posts/${postId}/comments`), {
        text: comment,
        username: user.displayName,
        timestamp: serverTimestamp()
      })
      setComment("")
    }
    else {

    }
  }
  return (
    <div className='post'>
      <div className="postHeader">
        {/* header = avatar + username */}
        <img className='avatar avatarImg' alt="username" src={avatar} />
        <h3 className='flex-1'>{username}</h3>
        <DotsHorizontalIcon className='navBtn' />
      </div>

      {/* image */}
      <img className='min-w-full' src={img} alt="" />
      {/* <img className='post_image' src="logo512.png" alt="" /> */}

      <div className='pl-2 pr-2'>
        <div className='flex'>
          <div className="postInteraction">
            <HeartIcon className='navBtn h-7' onClick={() => { }} />
            {/* <CommentIcon className='navBtn' /> */}
            <ChatIcon className="navBtn" />
            <div className="navBtn max-w-min">
              <PaperAirplaneIcon className='navBtn rotate-[70deg] -mt-1' />
            </div>
          </div>
          <div className='z-10 my-auto'>
            <BookmarkIcon className="navBtn" />
          </div>
        </div>
        
        <h3 className='font-semibold'>2 Likes</h3>
        {/* username + caption */}
        <h4 className='truncate'><strong>{username}</strong> {caption}</h4>
        <form action="" className="postCommentBox">
          <EmojiHappyIcon className='h-7 absolute pl-3' />
          <input type="text" className="postCommentInput"
            placeholder='Add a comment...' value={comment}
            onChange={(e) => { setComment(e.target.value) }} />
          <button className='postCommentBtn'
            onClick={postComment}
            disabled={!comment}>Post</button>
        </form>
      </div>
    </div>
  )
}

export default Post