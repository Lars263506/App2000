import { Club } from "@/types/club"

interface ClubHeaderProps {
    clubData: Club | null
}

const ClubHeader: React.FC<ClubHeaderProps> = ({ clubData }) => {
    return (
        <div
        aria-label="Club header"
        className="flex flex-col justify-center items-center w-full bg-white shadow-md rounded-lg p-4"
        >
          <h1 className="text-2xl font-bold border-b-2 border-black pb-2">{clubData?.name}</h1>
        </div>
    )
}

export default ClubHeader
