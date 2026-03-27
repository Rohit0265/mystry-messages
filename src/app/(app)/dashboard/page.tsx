'use client'

import { Message } from '@/model/User'
import React, { useState } from 'react'
import { toast } from 'sonner'

const Dashboard = () => {
  const [messages,setMessages] = useState<Message[]>([])
  const [isLoading,setIsLoading] = useState(false)
  const [isSwitchLoading,setIsSwitchLoading] = useState(false)
  // toast()
  const handleDeleteMessage = (messageId:string)=>{
    setMessages(messages.filter((message)=>message._id !== messageId))
  }
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard