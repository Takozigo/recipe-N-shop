import { Link } from '@tanstack/react-router'

function header() {
  return (
    <header className="bg-background glass-card fixed z-50 h-10 w-full md:h-20">
      <div className="mx-auto flex h-full max-w-4xl items-center justify-between font-semibold">
        <Link to={'/'} className="text-primary">
          RECIPES
        </Link>
      </div>
    </header>
  )
}

export default header
