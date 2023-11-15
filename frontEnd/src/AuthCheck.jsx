import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from './auth';

const AuthCheck = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = getAuthToken();

        if (!token) {
            // Redirecionar para a página de login
            navigate('/SignIn');
        }
        console.log(token)
    },);
    
    return (
        <div>test
            <p>{}</p>
        </div>
    )
};

export default AuthCheck;
