import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'
import { PrismaAdapter } from '../../../lib/auth/prisma-adapter'

const SCOPE_USER_INFO_EMAIL = 'https://www.googleapis.com/auth/userinfo.email'
const SCOPE_USER_INFO_PROFILE =
  'https://www.googleapis.com/auth/userinfo.profile'
const SCOPE_CALENDAR = 'https://www.googleapis.com/auth/calendar'

export function buildNextAuthOptions(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res']
): NextAuthOptions {
  return {
    adapter: PrismaAdapter(req, res),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
            scope: `${SCOPE_USER_INFO_EMAIL} ${SCOPE_USER_INFO_PROFILE} ${SCOPE_CALENDAR}`,
          },
        },
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub,
            name: profile.name,
            username: '',
            email: profile.email,
            avatar_url: profile.picture,
          }
        },
      }),
    ],
    callbacks: {
      async signIn({ account }) {
        if (!account?.scope?.includes(SCOPE_CALENDAR)) {
          return '/register/connect-calendar?error=permissions'
        }

        return true
      },
      async session({ session, user }) {
        return {
          ...session,
          user,
        }
      },
    },
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, buildNextAuthOptions(req, res))
}
