import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Container, Form, FormError, Header } from './styles'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from '../../lib/axios'
import { AxiosError } from 'axios'
import { message } from '../../utils/message'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras e hifens.',
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter pelo menos 3 letras.' }),
})

type RouteQuery = { username: string | undefined }
type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const router = useRouter()
  const { username } = router.query as RouteQuery

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const handleRegisterForm = async ({ name, username }: RegisterFormData) => {
    try {
      await api.post('/users', { name, username })
      message({
        description: 'Usuário cadastrado com sucesso!',
      })

      await router.push('/register/connect-calendar')
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

  useEffect(() => {
    if (username) {
      setValue('username', username)
    }
  }, [username, setValue])

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>
        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegisterForm)}>
        <label>
          <Text size="sm">Nome do usuário</Text>
          <TextInput
            prefix="call.com/"
            placeholder="seu-usuário"
            {...register('username')}
          />

          {errors.username && (
            <FormError size="sm">{errors.username.message}</FormError>
          )}
        </label>
        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput placeholder="Seu nome" {...register('name')} />
          {errors.name && (
            <FormError size="sm">{errors.name.message}</FormError>
          )}
        </label>
        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
