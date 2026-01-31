import { TanStackDevtools } from '@tanstack/react-devtools'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import appCss from '../styles.css?url'
import Header from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import { NotFound } from '@/components/not-found'
import { getThemeServerFn } from '@/lib/theme'
import { ThemeProvider } from '@/lib/providers/theme-provider'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  loader: () => getThemeServerFn(),
  shellComponent: RootDocument,
  notFoundComponent: () => <NotFound />,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const theme = Route.useLoaderData()

  return (
    <html lang="en" className={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <Header />
          <main className="pt-10 md:pt-20">{children}</main>
          <Toaster />
        </ThemeProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
