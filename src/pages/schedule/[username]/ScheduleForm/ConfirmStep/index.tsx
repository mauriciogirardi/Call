import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { CalendarBlank, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '../../../../../lib/axios'
import { formatDate } from '../../../../../utils/formatDate'
import { message } from '../../../../../utils/message'

import { ConfirmForm, ConfirmHeader, FormActions, FormError } from './styles'

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome precisa no mínimo 3 caracteres!' }),
  email: z.string().email({ message: 'Dígite um e-mail válido!' }),
  observations: z.string().nullable(),
})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

interface ConfirmStep {
  schedulingDate: Date
  onCancelConfirmation: () => void
}

export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStep) {
  const router = useRouter()
  const username = String(router.query.username)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  })

  const describeDate = formatDate({
    date: schedulingDate,
    type: 'dateWithTime',
  })
  const describeTime = formatDate({ date: schedulingDate, type: 'time' })

  const handleConfirmScheduling = async ({
    email,
    name,
    observations,
  }: ConfirmFormData) => {
    try {
      await api.post(`/users/${username}/schedule`, {
        name,
        email,
        observations,
        date: schedulingDate,
      })

      message({
        description: 'Agendamento salvo com sucesso!',
        type: 'success',
      })

      onCancelConfirmation()
    } catch (error) {
      console.error(error)
      if (error instanceof AxiosError) {
        message({
          description: error.response?.data?.message,
          type: 'error',
        })
      } else {
        console.error(error)
        message({
          description: 'Error ao salvar o agendamento, tente novamente!',
          type: 'error',
        })
      }
    }
  }

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <ConfirmHeader>
        <Text>
          <CalendarBlank />
          {describeDate}
        </Text>
        <Text>
          <Clock />
          {describeTime}
        </Text>
      </ConfirmHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput placeholder="Seu nome" {...register('name')} />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>
      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput placeholder="johndoe@exemplo.com" {...register('email')} />
        {errors.email && (
          <FormError size="sm">{errors.email.message}</FormError>
        )}
      </label>
      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register('observations')} />
      </label>

      <FormActions>
        <Button
          type="button"
          variant="tertiary"
          disabled={isSubmitting}
          onClick={onCancelConfirmation}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  )
}
