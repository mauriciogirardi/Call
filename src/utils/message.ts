import { toast, TypeOptions } from 'react-toastify'

type Message = {
  description: string
  type?: TypeOptions
}

export const message = ({ description, type = 'success' }: Message) => {
  return toast(description, {
    position: 'bottom-right',
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
    type,
  })
}
