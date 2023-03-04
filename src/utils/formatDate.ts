import dayjs from 'dayjs'

interface FormatDateProps {
  date: Date | null
  type?:
    | 'weekDay'
    | 'describedDate'
    | 'selectedDateWithoutTime'
    | 'dateWithTime'
    | 'time'
}

export const formatDate = ({ date, type = 'weekDay' }: FormatDateProps) => {
  return {
    weekDay: date ? dayjs(date).format('dddd') : null,
    describedDate: date ? dayjs(date).format('DD [de] MMMM') : null,
    selectedDateWithoutTime: date ? dayjs(date).format('YYYY-MM-DD') : null,
    dateWithTime: date ? dayjs(date).format('DD [de] MMMM [de] YYYY') : null,
    time: date ? dayjs(date).format('HH:mm[h]') : null,
  }[type]
}
