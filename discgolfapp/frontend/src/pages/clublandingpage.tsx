import MemberBenefit from '@/components/clubpage/memberbenefit'

const ClublandingPage = () => {

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex flex-col sm:flex-row items-start gap-4 px-4 py-4'>
        <MemberBenefit />
      </div>
    </div>
  )
}

export default ClublandingPage
