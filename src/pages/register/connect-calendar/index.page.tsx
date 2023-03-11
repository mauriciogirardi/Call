import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { signIn, useSession } from 'next-auth/react'
import { ArrowRight } from 'phosphor-react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import Image from 'next/image'

import { AuthError, ConnectBox, ConnectItem, ContentButton } from './styles'
import { Container, Header } from '../styles'

type DataUser = {
  user: {
    avatar_url?: string
    email: string
    name: string
    username?: string
    id?: string
  }
}

export default function ConnectCalendar() {
  const router = useRouter()
  const hasAuthError = !!router.query.error
  const { data, status } = useSession()
  const { user } = (data as DataUser) || {}

  const isAuthenticated = status === 'authenticated'
  const connectMessage = isAuthenticated ? 'Conectado' : 'Conectar'

  const handleConnectCalendar = async () => await signIn('google')

  return (
    <>
      <NextSeo title="Conecte sua agenda do Google | Call" noindex />

      <Container>
        <Header>
          <Heading as="strong">Conecte sua agenda!</Heading>
          <Text>
            Conecte o seu calendário para verificar automaticamente as horas
            ocupadas e os novos eventos à medida em que são agendados.
          </Text>
          <MultiStep size={4} currentStep={2} />
        </Header>

        <ConnectBox>
          <ConnectItem>
            <Text>Google Calendar</Text>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleConnectCalendar}
              disabled={isAuthenticated}
            >
              <ContentButton>
                {isAuthenticated && user?.avatar_url && (
                  <Image
                    src={user.avatar_url}
                    alt=""
                    width={25}
                    height={25}
                    style={{ borderRadius: '50%' }}
                  />
                )}
                {connectMessage}
              </ContentButton>
            </Button>
          </ConnectItem>
          {hasAuthError && (
            <AuthError size="sm">
              Falha ao se conectar ao Google, verifique se você habilitou as
              permissões de acesso ao Google Calendar
            </AuthError>
          )}
          <Button
            type="button"
            disabled={!isAuthenticated}
            onClick={() => router.push('/register/time-intervals')}
          >
            Próximo passo
            <ArrowRight />
          </Button>
        </ConnectBox>
      </Container>
    </>
  )
}
