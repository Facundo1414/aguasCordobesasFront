// app/layout.tsx
import { fonts } from './fonts'
import { Providers } from './providers'
import '../styles/globals.css'
import Breadcrumbs from '@/components/extra/Breadcrums'
import Navbar from '@/components/Navbar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang='en' className={fonts.montserrat.variable}>
      <body>
        <Providers>
          <Navbar/>
          <Breadcrumbs />
          {children}
        </Providers>
      </body>
    </html>
  )
}
