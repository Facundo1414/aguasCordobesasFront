// app/layout.tsx
import { fonts } from './fonts'
import { Providers } from './providers'
import '../styles/globals.css'
import Breadcrumbs from '@/components/extra/Breadcrums'
import Navbar from '@/components/Navbar'
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  
  return (
    <html lang='en' className={fonts.montserrat.variable}>
      <UserProvider>
        <body>
          <Providers>
            <Navbar/>
            <Breadcrumbs />
            {children}
          </Providers>
        </body>
      </UserProvider>
    </html>
  )
}
