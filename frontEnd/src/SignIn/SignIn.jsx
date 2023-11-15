import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css'
import barberLogo from './barber-logo.png';


function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);

    const navigate = useNavigate();

    async function sendForm(e) {
        e.preventDefault();

        let response = await fetch('http://localhost:8000/SignIn', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                password: password,
                email: email
            })
        });
        
        response = await response.json();

        if (response.success) {
            // Armazene o token no localStorage
            localStorage.setItem('token', response.token);
            setMessage('Seja Bem Vindo!');
              setTimeout(() => {
                setMessage(null);
                navigate('/');
              }, 2000);
        } else {
            setMessage('Erro ao realizar o Login!');
                setTimeout(() => {
                    setMessage(null);
                  }, 2000);
        }
    }

    return (
        <form onSubmit={sendForm} className="container">
            <div className="imgBox">
                <img src={barberLogo} alt="" />
            </div>
            <h2 id='HeaderSignIn'>Barbeasy</h2>
            {message === "Seja Bem Vindo!" ? (
                <p className="sucess">{message}</p>
                ) : (
                <p className="error">{message}</p>
            )}
                <div className="inputBox">
                    <input type="text" id="email" name="email" onChange={e => setEmail(e.target.value)} placeholder='Email'/>
                    <i className="fa-regular fa-user"></i>
                </div>
                <div className="inputBox">
                    <input type="password" id="password" name="password" onChange={e => setPassword(e.target.value)} placeholder='Password' />
                    <i className="fa-solid fa-lock"></i>
                </div>
                <div className='inputBox'>
                    <input type="submit" value="Entrar"/>
                </div>
                <Link className="link" to="/SignUp">Criar Conta</Link>
            </form>
    );
}

export default SignIn;