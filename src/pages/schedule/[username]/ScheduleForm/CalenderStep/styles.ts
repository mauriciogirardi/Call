import { Box, styled, Text } from '@ignite-ui/react'

export const Container = styled(Box, {
  margin: '$6 auto 0',
  padding: 0,
  maxWidth: '100%',
  position: 'relative',
  display: 'grid',

  variants: {
    isTimerPickerOpen: {
      true: {
        gridTemplateColumns: '1fr 280px',

        '@media(max-width: 900px)': {
          gridTemplateColumns: '1fr',
        },
      },
      false: {
        gridTemplateColumns: '1fr',
        width: 540,
      },
    },
  },
})

export const TimerPicker = styled('div', {
  borderLeft: '1px solid $gray600',
  padding: '$6 $6 0',
  overflowY: 'scroll',
  width: 280,
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,

  '@media (max-width: 900px)': {
    position: 'relative',
    overflowY: 'auto',
    height: '200px',
    width: '100%',
  },

  /* Works on Firefox */
  '&': {
    scrollbarWidth: 'thin',
    scrollbarColor: '$gray700 $gray900',
  },
  /* Works on Chrome, Edge, and Safari */
  '&::-webkit-scrollbar': {
    width: '10px',
  },

  '&::-webkit-scrollbar-track': {
    background: '$gray700', // color of the tracking area
  },

  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '$gray900', //color of the scroll thumb
    borderRadius: '0 20px 20px 0', // roundness of the scroll thumb
  },
})

export const TimerPickerHeader = styled(Text, {
  fontWeight: '$medium',

  span: {
    color: '$gray200',
  },
})

export const TimerPickerList = styled('div', {
  marginTop: '$3',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$2',

  '@media (max-width: 900px)': {
    gridAutoColumns: '2fr',
  },
})

export const TimerPickerItem = styled('button', {
  border: 0,
  backgroundColor: '$gray600',
  color: '$gray100',
  fontWeight: '$medium',
  padding: '$2 0',
  cursor: 'pointer',
  fontSize: '$sm',
  borderRadius: '$sm',
  lineHeight: '$base',

  '&:last-child': {
    marginBottom: '$6',
  },

  '&:disabled': {
    background: 'none',
    cursor: 'default',
    opacity: 0.4,
  },

  '&:not(:disabled):hover': {
    background: '$gray500',
  },

  '&:focus': {
    boxShadow: '0 0 0 1px $colors$gray100',
  },
})

export const LoadingHours = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 150,
})
