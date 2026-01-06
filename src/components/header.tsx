import { Link } from '@tanstack/react-router'
import React from 'react'

function header() {
  return (
    <header className="fixed h-10 md:h-20 border w-full m-a bg-background blur-2xl">
      <div className="max-w-4xl mx-auto flex items-center h-full font-semibold">
        <Link to={'/'}>RECIPES</Link>
      </div>
    </header>
  )
}

export default header
