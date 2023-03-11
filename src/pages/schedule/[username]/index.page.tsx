import { GetStaticPaths, GetStaticProps } from 'next'
import { Avatar, Heading, Text } from '@ignite-ui/react'
import { NextSeo } from 'next-seo'

import { Container, UserHeader } from './styles'
import { ScheduleForm } from './ScheduleForm'
import { prisma } from '../../../lib/prisma'

interface ScheduleProps {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <>
      <NextSeo title={`Agendar com  ${user.name} | Call`} />
      <Container>
        <UserHeader>
          <Avatar src={user.avatarUrl} alt={user.name} />
          <Heading>{user.name}</Heading>
          <Text>{user.bio}</Text>
        </UserHeader>

        <ScheduleForm />
      </Container>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  const { bio, name, avatar_url: avatarUrl } = user
  return {
    props: {
      user: {
        name,
        bio,
        avatarUrl,
      },
    },
    revalidate: 60 * 60 * 24, // 1day
  }
}
