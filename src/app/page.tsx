'use client'
import Chat from '@/components/chat'
import Header from '@/components/header'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center overflow-hidden bg-[url(/images/background.png)] bg-cover'>
      <>
        <Header />
        <Chat />
      </>
    </main>
  )
}
