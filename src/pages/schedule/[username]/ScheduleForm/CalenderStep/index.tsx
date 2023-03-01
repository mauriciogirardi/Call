import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Calendar } from '../../../../../components/Calendar'
import { Spinner } from '../../../../../components/Spinner'
import { api } from '../../../../../lib/axios'
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

export function CalendarStep() {
  const router = useRouter()
  const username = router.query?.username

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const isDateSelected = !!selectedDate
  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD [de] MMMM')
    : null
  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

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
        return message({
          type: 'error',
          description: 'Erro ao carregar as horas, tente novamente!',
        })
      },
    }
  )

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
