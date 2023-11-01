import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

function SingUp() {
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
                navigate('/SingIn')
            }else{
                alert(res.data.Error);
            }
                
            })
        .then(err =>console.log(err));
    }

    return (
    <>
      <div>
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nome">Nome:</label>
        <input type="text" id="name" name="name" onChange={ e => setValues({...values, name: e.target.value})} /><br/><br/>

        <label htmlFor="email">email:</label>
        <input type="text" id="email" name="email" onChange={ e => setValues({...values, email: e.target.value})} /><br/><br/>

        <label htmlFor="senha">senha:</label>
        <input type="text" id="senha" name="senha" onChange={ e => setValues({...values, senha: e.target.value})} /><br/><br/>

        <button type="submit">Cadastrar</button>
        <Link to="/SingIn">Fazer Login</Link>
      </form>
    </div>
    
    </>
    )
  }
  
  export default SingUp  