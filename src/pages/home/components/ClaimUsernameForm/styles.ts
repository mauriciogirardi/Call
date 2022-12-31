import { styled, Box, Text } from '@ignite-ui/react'
import { MEDIA_600 } from '../../../../styles/media'

export const Form = styled(Box, {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: '$2',
  marginTop: '$4',
  padding: '$4',

  [`${MEDIA_600}`]: {
    gridTemplateColumns: '1fr',
  },
})

export const FormAnnotation = styled('div', {
  marginTop: '$2',

  [`> ${Text}`]: {
    color: '#ea6060',
  },

  '.message-default': {
    color: '$gray400',
  },
})
