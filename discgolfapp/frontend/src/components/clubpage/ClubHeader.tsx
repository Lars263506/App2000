import Club from "@/types/club";

interface ClubHeaderProps {
  clubData: Club | null;
}

const ClubHeader: React.FC<ClubHeaderProps> = ({ clubData }) => {
  return (
    <div
      aria-label="Club header"
      className="flex flex-col items-center justify-center w-full p-4 bg-white shadow-md rounded-lg"
    >
      <h1 className="pb-2 text-2xl font-bold border-b-2 border-black">
        {clubData?.name}
      </h1>
    </div>
  );
};

export default ClubHeader;
