import { Link } from '@tanstack/react-router'

function header() {
  return (
    <header className="m-a bg-background fixed h-10 w-full border md:h-20">
      <div className="mx-auto flex h-full max-w-4xl items-center font-semibold">
        <Link to={'/'}>RECIPES</Link>
      </div>
    </header>
  )
}

export default header
