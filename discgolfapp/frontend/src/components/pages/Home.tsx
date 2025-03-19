import DiscgolfInfo from '../frontpage/discgolfinfo';
import Navigation from '../frontpage/navigation';

interface HomeProps {
    setSelectedPage: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ setSelectedPage }) => {
    return (
        <div aria-label="Home">
            <DiscgolfInfo />
            <Navigation setSelectedPage={setSelectedPage} />
        </div>
    )
}

export default Home
