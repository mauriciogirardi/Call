import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Calendar } from '../../../../../components/Calendar'
import { Spinner } from '../../../../../components/Spinner'
import { api } from '../../../../../lib/axios'
import { formatDate } from '../../../../../utils/formatDate'
import { message } from '../../../../../utils/message'
import {
  Container,
  LoadingHours,
  TimerPicker,
  TimerPickerHeader,
  TimerPickerItem,
  TimerPickerList,
} from './styles'

type AvailabilityData = {
  availableTimes: number[]
  possibleTimes: number[]
}

interface CalendarStepProps {
  onSelectedDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectedDateTime }: CalendarStepProps) {
  const router = useRouter()
  const username = router.query?.username

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const isDateSelected = !!selectedDate
  const weekDay = formatDate({ date: selectedDate })
  const describedDate = formatDate({
    date: selectedDate,
    type: 'describedDate',
  })
  const selectedDateWithoutTime = formatDate({
    date: selectedDate,
    type: 'selectedDateWithoutTime',
  })

  const { data: availability, isLoading } = useQuery<AvailabilityData>(
    ['availability', selectedDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })
      return response.data
    },
    {
      enabled: !!selectedDate,
      onError: (err) => {
        console.error(err)
        return message({
          type: 'error',
          description: 'Erro ao carregar as horas, tente novamente!',
        })
      },
    }
  )

  const handleSelectTime = (hour: number) => {
    const dateWihTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()
    onSelectedDateTime(dateWihTime)
  }

  return (
    <Container isTimerPickerOpen={isDateSelected}>
      <Calendar onDateSelected={setSelectedDate} selectedDate={selectedDate} />

      {isDateSelected && (
        <TimerPicker>
          <TimerPickerHeader>
            {weekDay} <span>{describedDate}</span>
          </TimerPickerHeader>

          <TimerPickerList>
            {isLoading ? (
              <LoadingHours>
                <Spinner message="Carregando as horas disponíveis!" size={24} />
              </LoadingHours>
            ) : (
              <>
                {availability?.possibleTimes.map((hour) => (
                  <TimerPickerItem
                    key={hour}
                    disabled={!availability.availableTimes.includes(hour)}
                    onClick={() => handleSelectTime(hour)}
                  >
                    {String(hour)}:00h
                  </TimerPickerItem>
                ))}
              </>
            )}
          </TimerPickerList>
        </TimerPicker>
      )}
    </Container>
  )
}
