import Link from 'next/link'

export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900">
        <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">
            404
          </h1>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="mb-8 max-w-md text-gray-600 dark:text-gray-300">
            Sorry, the page you are looking for does not exist or has been
            moved.
          </p>
          <Link
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            href="/en"
          >
            Go to Homepage
          </Link>
        </main>
      </body>
    </html>
  )
}
