import React from 'react'
import $axios from '../http'
import { useQuery } from '@tanstack/react-query'

const Home = () => {
  const {data, isLoading, error} = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await $axios.get('/')
      return res.data
    },
  onSuccess: (data) => {
    console.log(data)
  },
  onError: (error) => {
    console.log(error)
  }
  })
  console.log(data)
  return (
    <div>Home</div>
  )
}

export default Home