import Navigation from '../frontpage/Navigation';

/**
 Copilot has been used to generate the code for the functions and comments,
but all content has been reviewed and edited to ensure accuracy and alignment
with the project's requirements.
*/

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
