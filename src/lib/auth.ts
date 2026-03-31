import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcrypt'
import GoogleProvider from 'next-auth/providers/google'
import type { GoogleProfile } from 'next-auth/providers/google'
import { verifyTurnstile } from './turnstile'

declare module 'next-auth' {
  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    username?: string | null;
    roles?: string | null;
    walletBalance?: number | null;
    isMember?: boolean | null;
    membershipType?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      username?: string | null;
      roles?: string | null;
      walletBalance?: number | null;
      isMember?: boolean | null;
      membershipType?: string | null;
    }
  }
}

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'hello@example.com' },
        password: { label: 'Password', type: 'password' },
        turnstileToken: { label: 'Turnstile Token', type: 'hidden' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password')
        }

        // Verify Turnstile
        if (process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY) {
          const isHuman = await verifyTurnstile(credentials.turnstileToken || "");
          if (!isHuman) {
            throw new Error('Security verification failed. Please try again.');
          }
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          throw new Error('No user found with this email')
        }

        if (!user.password) {
          throw new Error('Please sign in with your social account')
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          username: user.username,
          isMember: user.isMember,
          membershipType: user.membershipType,
          walletBalance: user.walletBalance || 0,
          roles: user.roles || 'user',
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: profile.email?.split('@')[0] || profile.sub,
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      console.log('session callback', { session, token });

      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
        session.user.username = token.username as string
        session.user.roles = token.roles as string
        session.user.walletBalance = token.walletBalance as number
        session.user.isMember = token.isMember as boolean
        session.user.membershipType = token.membershipType as string
      }
      return session
    },
    async jwt({ token, user, account, profile, trigger, session }) {
      if (trigger === 'update') {
        const freshUser = await prisma.user.findUnique({
          where: { email: token.email as string }
        });
        if (freshUser) {
          token.id = freshUser.id;
          token.name = freshUser.name;
          token.picture = freshUser.image;
          token.username = freshUser.username;
          token.roles = freshUser.roles;
          token.walletBalance = freshUser.walletBalance;
          token.isMember = freshUser.isMember;
          token.membershipType = freshUser.membershipType;
        }
      } else if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        token.username = user.username
        token.roles = user.roles
        token.walletBalance = user.walletBalance
        token.isMember = user.isMember
        token.membershipType = user.membershipType
      }
      return token
    },
    async signIn({ user, account, profile }) {
      console.log('signIn callback', { user, account, profile });

      if (account?.provider === 'google') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: {
              accounts: true
            }
          })

          if (existingUser) {
            // Check if user already has an account with this provider
            const existingAccount = existingUser.accounts.find(
              acc => acc.provider === account.provider
            )

            if (!existingAccount) {
              // Link the new OAuth account to the existing user
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  expires_at: account.expires_at,
                }
              })
            }

            // Update user profile data
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name,
                image:
                  user.image ||
                  (account?.provider === 'google' && (profile as import('next-auth/providers/google').GoogleProfile).picture) ||
                  existingUser.image,
                emailVerified: new Date(),
              }
            })
          } else {
            // Create new user with social profile
            const username = user.email?.split('@')[0] || user.id
            let uniqueUsername = username
            let counter = 1

            // Ensure username uniqueness
            while (await prisma.user.findFirst({ where: { username: uniqueUsername } })) {
              uniqueUsername = `${username}${counter}`
              counter++
            }

            await prisma.user.create({
              data: {
                id: user.id,
                email: user.email!,
                name: user.name,
                image: user.image,
                username: uniqueUsername,
                roles: 'user',
                emailVerified: new Date(),
                profileInitialized: true,
                isMember: true,
                membershipType: 'free',
                memberSince: new Date(),
                favoriteTeam: 'FC Escuela',
                language: 'English',
                accounts: {
                  create: {
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    expires_at: account.expires_at,
                  }
                }
              }
            })
          }
          return true
        } catch (error) {
          console.error('Error during social sign in:', error)
          return false
        }
      }


      return true
    }
  },
  events: {
    async signIn({ user }) {
      if (user?.email) {
        try {
          await prisma.user.update({
            where: { email: user.email },
            data: { lastLogin: new Date() },
          });
        } catch (err) {
          console.error('Error updating lastLogin:', err);
        }
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
    signOut: '/auth/signout',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}