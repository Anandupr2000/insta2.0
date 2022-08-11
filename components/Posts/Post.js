import React, { useState } from 'react'
import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid'
import { useSession } from "next-auth/react"
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useEffect } from 'react';
import Moment from 'react-moment';
import styled, { keyframes } from "styled-components"
import { zoomIn, fadeOut } from 'react-animations'

function Post({ postId, username, avatar, caption, img }) {
  const animDuration = 1500
  const [animVisible, setAnimVisible] = useState(false)
  const { data: session } = useSession()
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState([])
  // state for post liked by client
  const [hasLiked, setHasLiked] = useState(false)
  // state for comment liked by client
  const [likedComments, setLikedComment] = useState([])

  const [less, setLess] = useState(true)
  const Flip = styled.div`animation: 1s ${keyframes`${zoomIn}`} 1`

  useEffect(() => onSnapshot(
    query(
      collection(db, `posts/${postId}/comments`),
      orderBy("timestamp", "desc")
    ), snapshot => setComments(snapshot.docs)
  ), [db, postId])
  useEffect(() => onSnapshot(
    query(
      collection(db, `posts/${postId}/likes`),
    ), snapshot => setLikes(snapshot.docs)
  ), [db, postId])

  useEffect(
    () => setHasLiked(likes.findIndex(like => (like.id === session?.user?.uid)) !== -1), [likes]
  )

  const likePost = async (e) => {
    setAnimVisible(true)
    setTimeout(() => {
      setAnimVisible(false)
    }, animDuration)

    e.preventDefault()
    if (hasLiked) {
      await deleteDoc(doc(db, `posts/${postId}/likes/${session.user.uid}`))
    }
    else {
      await setDoc(doc(db, `posts/${postId}/likes/${session.user.uid}`), {
        username: session?.user?.username
      })
    }
  }
  const postComment = async (e) => {
    e.preventDefault();
    console.log("comments => ")
    console.log(comments[0]?.id)
    setComment("Posting....")
    await addDoc(collection(db, `posts/${postId}/comments`), {
      text: comment,
      username: session.user.username,
      profileImg: session.user.image,
      timestamp: serverTimestamp()
    })
    setComment("")
  }
  const likeComment = async (commentId) => {
    const docRef = doc(db, `posts/${postId}/comments/${commentId}/likes/${session.user.uid}`)
    likedComments.map(async likedComment => {
      if (likedComment.id === commentId) {
        await deleteDoc(docRef)
        likedComments.splice(likedComments.findIndex(comment => {
          if (comment.id === commentId) return comment
        }), 1)
        console.log(`unliked comment ${docRef}`)
        return
      }
    })

    setLikedComment([...likedComments, commentId])
    await setDoc(docRef, {
      username: session.user.username,
      timestamp: serverTimestamp()
    })
    console.log(`liked comment ${docRef.id}`)

    // console.log(commentLikes)
    // commentLikes.find()
    // if (commentLikes.find(comment => (comment.username === session.user.username))) { setLikedComment(true) }
  }
  return (
    <div className='post'>
      <div className="postHeader">
        {/* header = avatar + username */}
        <img className='avatar avatarImg' alt="avatar" src={avatar} />
        <h3 className='flex-1'>{username}</h3>
        <DotsHorizontalIcon className='navBtn' />
      </div>
      {/* image */}
      <div className='flex items-center justify-center object-contain h-96'>
        <Flip className={`${(hasLiked && animVisible) ? "block" : 'block'} w-96 z-10 absolute min-w-max`}>
          <HeartIconSolid fill='red' className='relative max-h-min' />
        </Flip>
        <img className='max-h-96' src={img} alt="" />
      </div>
      {/* <img className='post_image' src="logo512.png" alt="" /> */}

      <div className='pl-2 pr-2 max-h-min'>
        <div className='flex'>
          <div className="postInteraction">
            {/* {hasLiked && console.log(likes.find(like => (like.id === session?.user?.uid) !== -1))} */}
            {
              hasLiked ?
                <HeartIconSolid fill='red' className='navBtn h-7' onClick={likePost} />
                : <HeartIcon className='navBtn h-7' onClick={likePost} />
            }
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
        {
          (likes.length > 0) &&
            <h3 className='font-semibold'>{likes.length} Likes</h3>
        }
        {/* username + caption */}
        <h4 className='truncate'><strong>{username}</strong> {caption}</h4>

        {/* commentbox */}
        {
          session &&
          <form action="" className="postCommentBox">
            <EmojiHappyIcon className='h-7 absolute pl-3' />
            <input type="text" className="postCommentInput"
              placeholder='Add a comment...' value={comment}
              onChange={(e) => { setComment(e.target.value) }} />
            <button className='postCommentBtn' type='submmit'
              onClick={postComment}
              disabled={!comment.trim()}>Post</button>
          </form>
        }

        {/* comments */}
        {
          comments.length > 0 &&
          <div className='mt-4 ml-10'>
            <div>
              {
                less &&
                <div key={comments[0].id} className="flex items-center my-auto space-x-2 mb-3 mr-4">
                  {
                    comments[0].data().profileImg ?
                      <img src={comments[0].data().profileImg} className="avatar avatarImg w-8 h-8" />
                      :
                      <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" className="avatar avatarImg w-8 h-8" />
                  }
                  <div className='flex-1'>
                    <p>{comments[0].data().text}</p>
                    <Moment fromNow className='text-xs font-light '>
                      {comments[0].data().timestamp?.toDate()}
                    </Moment>
                  </div>
                  {
                    console.log(comments[0].id)}
                  {
                    console.log(likedComments)
                  }
                  <div className='flex-col'>
                    {
                      console.log(comments[0].data().username)
                    }
                    {
                      console.log(session.user.username)
                    }
                    {
                      likedComments[0] == comments[0].id ?
                        <HeartIconSolid fill='red' className='navBtn h-5' onClick={() => likeComment(comments[0].id)} />
                        : <HeartIcon className='navBtn h-5' onClick={() => likeComment(comments[0].id)} />
                    }
                    <p className='text-xs text-center'>2</p>
                  </div>
                </div>
              }
            </div>
            {
              comments.length > 1 && less && <p className='cursor-pointer font-semibold' onClick={() => setLess(false)}>more</p>
            }
            {!less &&
              comments.map((comment, i) => (
                <div key={comment.id} className="flex items-center my-auto space-x-2 mb-3 mr-4">
                  {
                    comment.data().profileImg ?
                      <img src={comment.data().profileImg} className="avatar avatarImg w-8 h-8" />
                      :
                      <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" className="avatar avatarImg w-8 h-8" />
                  }
                  <div className='flex-1'>
                    <p>{comment.data().text}</p>
                    <Moment fromNow className='text-xs font-light '>
                      {comment.data().timestamp.toDate()}
                    </Moment>
                  </div>
                  <div className='flex-col'>
                    {
                      likedComments[i] == comment.id ?
                        <HeartIconSolid fill='red' className='navBtn h-5' onClick={() => likeComment(comment.data().id)} />
                        : <HeartIcon className='navBtn h-5' onClick={() => likeComment(comment.data().id)} />
                    }
                    <p className='text-xs text-center'>2</p>
                  </div>
                </div>))
            }
            {
              !less && <p className='cursor-pointer font-semibold' onClick={() => setLess(true)}>less</p>
            }
          </div>
        }
      </div>
    </div >
  )
}

export default Post