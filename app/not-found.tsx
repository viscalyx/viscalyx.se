import Link from 'next/link'

export default function RootNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-6xl font-bold">404</h1>
          <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
          <p className="mb-8 max-w-md text-gray-600">
            Sorry, the page you are looking for does not exist or has been
            moved.
          </p>
          <Link
            href="/en"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Go to Homepage
          </Link>
        </main>
      </body>
    </html>
  )
}
