import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { isDesignatedAdmin } from '@/lib/constants'

export async function requireAdmin() {
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in')
  }

  const isAdmin = session.user.role === 'admin' || isDesignatedAdmin(session.user.email)

  if (!isAdmin) {
    redirect('/unauthorized')
  }

  if (session.user.role !== 'admin') {
    session.user.role = 'admin'
  }

  return session
}