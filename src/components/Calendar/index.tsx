import { CalendarBlank, CaretLeft, CaretRight } from 'phosphor-react'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'

import { getShortWeekDays } from '../../utils/getWeekDays'
import { message } from '../../utils/message'
import { api } from '../../lib/axios'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
  ContainerLoading,
} from './styles'
import { Spinner } from '../Spinner'

interface CalendarWeek {
  week: number
  days: {
    date: dayjs.Dayjs
    disabled: boolean
  }[]
}

type CalenderWeeks = CalendarWeek[]

interface CalendarProps {
  selectedDate?: Date | null
  onDateSelected: (date: Date) => void
}

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

export function Calendar({ onDateSelected, selectedDate }: CalendarProps) {
  const router = useRouter()
  const username = String(router.query.username)
  const [currentDate, setCurrentDate] = useState(() => dayjs().set('date', 1))

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')
  const year = currentDate.get('year')
  const month = (currentDate.get('month') + 1).toString().padStart(2, '0')

  const { data: blockedDates, isLoading } = useQuery<BlockedDates>(
    ['blocker-dates', year, month],
    async () => {
      const response = await api(`/users/${username}/blocked-dates`, {
        params: {
          year,
          month,
        },
      })

      return response.data
    },
    {
      onError: (err) => {
        console.error(err)
        return message({
          type: 'error',
          description: 'Erro ao carregar os dias bloqueados!',
        })
      },
    }
  )

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) return []

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, index) => currentDate.set('date', index + 1))

    const firstWeekDay = currentDate.get('day')
    const previousMonthFillArray = Array.from({ length: firstWeekDay })
      .map((_, index) => currentDate.subtract(index + 1, 'day'))
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth()
    )
    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, index) => lastDayInCurrentMonth.add(index + 1, 'day'))

    const calendarDays = [
      ...previousMonthFillArray.map((date) => ({
        date,
        disabled: true,
      })),
      ...daysInMonthArray.map((date) => ({
        date,
        disabled:
          date.endOf('day').isBefore(new Date()) ||
          blockedDates.blockedWeekDays.includes(date.get('day')) ||
          blockedDates.blockedDates?.includes(date.get('date')),
      })),
      ...nextMonthFillArray.map((date) => ({
        date,
        disabled: true,
      })),
    ]

    const newCalendarWeeks = calendarDays.reduce<CalenderWeeks>(
      (weeks, _, index, original) => {
        const isNewWeek = index % 7 === 0
        if (isNewWeek) {
          weeks.push({
            week: index / 7 + 1,
            days: original.slice(index, index + 7),
          })
        }

        return weeks
      },
      []
    )

    return newCalendarWeeks
  }, [currentDate, blockedDates])

  const handlePreviousMonth = () => {
    const previousMonthDate = currentDate.subtract(1, 'month')
    setCurrentDate(previousMonthDate)
  }

  const handleNextMonth = () => {
    const nextMonthDate = currentDate.add(1, 'month')
    setCurrentDate(nextMonthDate)
  }

  const handleCurrentMonth = () => {
    const currentMonthDate = dayjs().set('date', 1)
    setCurrentDate(currentMonthDate)
  }

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>
        <CalendarActions>
          <button onClick={handleCurrentMonth} title="Mês atual">
            <CalendarBlank />
          </button>

          <button onClick={handlePreviousMonth} title="Mês anterior">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="Proximo mês">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {getShortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <ContainerLoading>
              <td colSpan={7}>
                <Spinner size={32} />
              </td>
            </ContainerLoading>
          ) : (
            calendarWeeks.map(({ week, days }) => (
              <tr key={week}>
                {days.map(({ date, disabled }) => (
                  <td key={date.toString()}>
                    <CalendarDay
                      disabled={disabled}
                      onClick={() => onDateSelected(date.toDate())}
                    >
                      {date.get('date')}
                    </CalendarDay>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
