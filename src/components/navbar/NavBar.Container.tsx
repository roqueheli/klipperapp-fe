import { cookies } from 'next/headers';
import NavBar from './NavBar';

const NavBarContainer = async () => {
    try {
        const cookiesStore = cookies();
        const auth_token = (await cookiesStore).get(process.env.AUTH_TOKEN_SECRET || '');

        return <NavBar auth_token={auth_token?.value} />;
    } catch (err) {
        throw new Error("Authentication token not found");
    }
};

export default NavBarContainer;
