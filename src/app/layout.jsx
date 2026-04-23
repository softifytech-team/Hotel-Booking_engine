import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import LayoutClient from '@/components/layout/LayoutClient'

export const metadata = {
  title: 'SaaSBook | Hotel Management Platform',
  description: 'Enterprise multi-tenant hotel management and booking system.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans selection:bg-indigo-500/30">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
