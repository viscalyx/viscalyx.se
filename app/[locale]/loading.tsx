import LoadingSpinner from '@/components/LoadingSpinner'

export default function LocaleLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}
