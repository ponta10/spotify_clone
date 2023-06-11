"use client";
import SongItem from '@/components/SongItem';
import { Songs } from '@/types'
import React from 'react'

interface PageContentProps {
    songs: Songs[];
}

const PageContent: React.FC<PageContentProps> = ({
    songs
}) => {
    if(songs.length === 0) {
        return (
            <div>No Songs Available!</div>
        )
    }
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mt-4'>
      {songs.map((item) => (
        <SongItem 
          onClick={(id: string) => {}} 
          key={item.id} 
          data={item}
        />
      ))}
    </div>
  )
}

export default PageContent