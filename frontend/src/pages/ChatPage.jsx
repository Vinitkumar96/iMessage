import React from 'react'
import toast from 'react-hot-toast'

const ChatPage = () => {
  return (
    <div>ChatPage

        <button onClick={() => toast.success("heyy")}>toast</button>
    </div>
  )
}

export default ChatPage