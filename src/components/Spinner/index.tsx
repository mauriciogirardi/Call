import { Text } from '@ignite-ui/react'
import Image from 'next/image'
import iconSpinner from '../../assets/spinner-48.png'
import { LoadingContainer } from './styles'

interface SpinnerProps {
  message?: string
  size?: number
}

export function Spinner({ message, size = 48 }: SpinnerProps) {
  return (
    <LoadingContainer>
      <Text size="sm">{message}</Text>
      <Image
        src={iconSpinner}
        alt="spinner"
        width={size}
        height={size}
        className="loading-img"
      />
    </LoadingContainer>
  )
}
