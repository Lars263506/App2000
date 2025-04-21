import Navigation from '../frontpage/Navigation';

interface HomeProps {
    setSelectedPage: (page: string) => void;
}

const HomePage: React.FC<HomeProps> = ({ setSelectedPage }) => {
    return (
        <div aria-label="Home">
            <Navigation setSelectedPage={setSelectedPage} />
        </div>
    )
}

export default HomePage
