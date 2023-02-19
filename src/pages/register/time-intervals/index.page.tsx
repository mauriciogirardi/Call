import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@ignite-ui/react'
import { AxiosError } from 'axios'
import { ArrowRight } from 'phosphor-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '../../../lib/axios'
import { convertTimeStringInMinutes } from '../../../utils/convertTimeStringInMinutes'
import { getWeekDays } from '../../../utils/getWeekDays'
import { message } from '../../../utils/message'
import { Container, Header } from '../styles'
import {
  FormError,
  IntervalBox,
  IntervalContainer,
  IntervalDay,
  IntervalInput,
  IntervalItem,
} from './styles'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana!',
    })
    .transform((intervals) =>
      intervals.map((interval) => ({
        weekDay: interval.weekDay,
        startTimeInMinutes: convertTimeStringInMinutes(interval.startTime),
        endTimeInMinutes: convertTimeStringInMinutes(interval.endTime),
      }))
    )
    .refine(
      (intervals) =>
        intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes
        ),
      {
        message:
          'O horário de término deve ser pelo menos 1h distante do início!',
      }
    ),
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '19:00' }, // Sunday
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '19:00' }, // Monday
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '19:00' }, // Tuesday
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '19:00' }, // Wednesday
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '19:00' }, // Thursday
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '19:00' }, // Friday
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '19:00' }, // Saturday
      ],
    },
  })

  const { fields } = useFieldArray({ name: 'intervals', control })

  const handleSetTimeIntervals = async (data: any) => {
    try {
      const { intervals } = data as TimeIntervalsFormOutput
      await api.post('users/time-intervals', intervals)
    } catch (error) {
      if (error instanceof AxiosError) {
        message({
          description: error.response?.data?.message,
          type: 'error',
        })
      } else {
        console.error(error)
      }
    }
  }

  const intervals = watch('intervals')

  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá</Heading>
        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </Text>
        <MultiStep size={4} currentStep={3} />
      </Header>

      <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <IntervalContainer>
          {fields.map((field, index) => (
            <IntervalItem key={field.id}>
              <IntervalDay>
                <Controller
                  name={`intervals.${index}.enabled`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                      checked={field.value}
                    />
                  )}
                />
                <Text>{getWeekDays(field.weekDay)}</Text>
              </IntervalDay>
              <IntervalInput>
                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  disabled={intervals[index].enabled === false}
                  {...register(`intervals.${index}.startTime`)}
                />
                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  disabled={intervals[index].enabled === false}
                  {...register(`intervals.${index}.endTime`)}
                />
              </IntervalInput>
            </IntervalItem>
          ))}
        </IntervalContainer>

        {errors.intervals && (
          <FormError size="sm">{errors.intervals.message}</FormError>
        )}

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  )
}
