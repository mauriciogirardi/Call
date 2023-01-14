import 'react-toastify/dist/ReactToastify.css'

import type { AppProps } from 'next/app'
import { globalStyles } from '../styles/global'
import { ToastContainer } from 'react-toastify'

globalStyles()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  )
}
