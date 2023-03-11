import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from '@ignite-ui/react'
import { unstable_getServerSession } from 'next-auth'
import { GetServerSideProps } from 'next'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'phosphor-react'
import { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { NextSeo } from 'next-seo'
import { z } from 'zod'

import { FormAnnotation, ProfileBox } from './styles'
import { buildNextAuthOptions } from '../../api/auth/[...nextauth].api'
import { Container, Header } from '../styles'
import { message } from '../../../utils/message'
import { api } from '../../../lib/axios'

const updateProfileSchema = z.object({
  bio: z.string(),
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

export default function UpdateProfile() {
  const session = useSession()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  })

  const handleUpdateProfile = async ({ bio }: UpdateProfileData) => {
    try {
      await api.put('/users/profile', { bio })
      message({
        type: 'success',
        description: 'Usuário cadastrado com sucesso!',
      })
      await router.push(`/schedule/${session.data?.user.username}`)
    } catch (error) {
      if (error instanceof AxiosError) {
        message({
          description: error.response?.data?.message,
          type: 'error',
        })
      } else {
        console.error(error)
        message({
          description: 'Error ao atualizar o usuário!',
          type: 'error',
        })
      }
    }
  }

  return (
    <>
      <NextSeo title="Atualize seu perfil | Call" noindex />

      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>
          <MultiStep size={4} currentStep={4} />
        </Header>

        <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <label>
            <Text size="sm">Foto do perfil</Text>
            <Avatar
              src={session.data?.user.avatar_url}
              alt={session.data?.user.name}
            />
          </label>
          <label>
            <Text size="sm">Sobre você</Text>
            <TextArea {...register('bio')} />
            <FormAnnotation size="sm">
              Fale um pouco sobre você. Isto será exibido em sua página pessoal.
            </FormAnnotation>
          </label>
          <Button type="submit" disabled={isSubmitting}>
            Finalizar
            <ArrowRight />
          </Button>
        </ProfileBox>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  )

  return {
    props: {
      session,
    },
  }
}
