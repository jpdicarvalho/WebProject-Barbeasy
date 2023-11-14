import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import './style.css';
import barberLogo from './barber-logo.png'


function SignUp() {
    const [values, setValues] = useState({
        name:'',
        email:'',
        senha:''
    })
    const navigate = useNavigate()
    const handleSubmit = (event) =>{
        event.preventDefault();
        axios.post('http://localhost:8000/SingUp', values)
        .then(res => {
            if(res.data.Status === "Success") {
                navigate('/SignIn')
            }else{
                alert(res.data.Error);
            }
                
            })
        .then(err =>console.log(err));
    }

    return (
    <>
      <form onSubmit={handleSubmit} className="container">
        <div className="imgBox">
            <img src={barberLogo} alt="" />
        </div>

        <h2 id="HeaderSignUp">Barbeasy</h2>
        <span>Cadastro de Usuário</span>

        <div className="inputBox">
            <input type="text" id="name" name="name" onChange={ e => setValues({...values, name: e.target.value})} placeholder="Nome"/>
            <i className="fa-regular fa-user"></i>
        </div>

        <div className="inputBox">
          <input type="text" id="email" name="email" onChange={ e => setValues({...values, email: e.target.value})} placeholder="Email"/>
          <i className="fa-solid fa-envelope"></i> 
        </div>

        <div className="inputBox">
           <input type="password" id="senha" name="senha" onChange={ e => setValues({...values, senha: e.target.value})} placeholder="Password"/>
           <i className="fa-solid fa-lock"></i>
        </div>

        <div className='inputBox'>
            <input type="submit" value="Cadastrar"/>
        </div>
        <Link className="link" to="/SignIn">Fazer Login</Link>
      </form>
    </>
    )
  }
  
  export default SignUp  