import LoadingSpinner from '@/components/LoadingSpinner'

export default function TeamMemberLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}
