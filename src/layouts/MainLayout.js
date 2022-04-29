import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../components/partials/Header';
import Footer from '../components/partials/Footer';

const MainLayout = () => {

    // const [spinner, setSpinner] = useState(true);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     setTimeout(() => setSpinner(false), 1500)
    // }, []);  

    // if (spinner) {
    //     return "..loading";
    // }

    return (
        <main className="bg-[#00051e] text-white leading-loose">
            <Header />
            <Outlet />
        </main>
    )
}


export default MainLayout;