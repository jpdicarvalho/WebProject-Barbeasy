import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function SingIn() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const navigate = useNavigate()

    async function sendForm() {
      
      let response = await fetch('http://localhost:8000/SingIn', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          password: senha,
          email: email
        })
      });
  
      if (response == true) {
        // Cadastro realizado com sucesso
        alert('Sucesso', 'Login realizado com sucesso!');
        navigate('/')
        
      } else if (response == false) {
        // Cadastro realizado com sucesso
        alert('Error', 'Erro ao fazer login !');
        
      }
  }
        

  return (
      <div>
      <h2>SingIn</h2>
      <form onSubmit={sendForm}>
        <label htmlFor="email">email:</label>
        <input type="text" id="email" name="email"  onChange={ e => setEmail(e.target.value)} /><br/><br/>

        <label htmlFor="senha">senha:</label>
        <input type="text" id="senha" name="senha" onChange={ e => setSenha(e.target.value)} /><br/><br/>

        <button type="submit">Entrar</button>
        <Link to="/SingUp">Criar Conta</Link>

      </form>
    </div>
    )
  }
  
  export default SingIn  