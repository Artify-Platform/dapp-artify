'use client'
import Feature from './components/feature'
import LevelSwitch from './components/level'
import Logo from './components/logo'
const Header = () => {
  return (
    <div className='header z-10 w-full items-center justify-center header backdrop-filter'>
      <div className='mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-2 md:px-20 md:py-4'>
        <Logo />
        <div className='hidden md:block'>
          <LevelSwitch />
        </div>
        <Feature />
      </div>
    </div>
  )
}

export default Header
