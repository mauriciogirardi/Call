import 'react-toastify/dist/ReactToastify.css'
import '../lib/dayjs'

import type { AppProps } from 'next/app'
import { globalStyles } from '../styles/global'
import { ToastContainer } from 'react-toastify'
import { SessionProvider } from 'next-auth/react'

globalStyles()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <ToastContainer />
    </>
  )
}
