import { keyframes, styled, Text } from '@ignite-ui/react'

const animationLoading = keyframes({
  '0%': { transform: 'rotate(0)' },
  '100%': { transform: 'rotate(360deg)' },
})

export const LoadingContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  gap: '$4',

  '.loading-img': {
    animation: `${animationLoading} 1s linear infinite`,
  },

  [`> ${Text}`]: {
    color: '$gray200',
    width: '$40',
    textAlign: 'center',
  },
})
