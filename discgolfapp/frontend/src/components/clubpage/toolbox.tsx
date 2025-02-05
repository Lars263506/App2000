import Announcement from "./announcements";
import FieldInformation from "../fieldinformation";
import MemberList from "./memberlist";

const Toolbox = () => {
    return (
        // Add styling to the div
        <div>
           <Announcement />
           <FieldInformation />
           <MemberList />
        </div>
    )
}

export default Toolbox;
