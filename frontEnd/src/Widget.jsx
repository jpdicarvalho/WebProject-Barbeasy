import { useEffect, useState } from "react";
import axios from "axios";
import './widget.css';


const Widget = () => {
  const [mostrarNome, setMostrarNome] = useState(false);
  const [novoUserName, setNovoUserName] = useState('');
  const [userNameBarbearia, setUserNameBarbearia] = useState('');
  const [messageUserName, setMessageUserName] = useState('');

  const barbeariaId = 1;

  const alternarNome = () => {
      setMostrarNome(!mostrarNome);
  };
  //Função responsável por enviar o novo nome de usuário ao back-end
  const alterarUserName = () => {
    axios.post(`https://api-user-barbeasy.up.railway.app/api/upload-user-name-barbearia/${barbeariaId}`, {newUserName: novoUserName})
      .then(res => {
          if(res.data.Success === 'Success'){
            setMessageUserName("Nome de Usuário Alterado com Sucesso!")
            // Limpar a mensagem após 3 segundos (3000 milissegundos)
            setTimeout(() => {
              setMessageUserName('');
              
            }, 3000);
          }
        })
        .catch(error => {
          setMessageUserName("Erro ao atualizar o nome de usuário.")
            // Limpar a mensagem após 3 segundos (3000 milissegundos)
            setTimeout(() => {
              setMessageUserName('');
              
            }, 3000);
          console.error('Erro ao atualizar o nome de usuário:', error);
        });
  };
  //Função para obter o nome de usuário atual da barbearia
  useEffect(() => {
    axios.get(`https://api-user-barbeasy.up.railway.app/api/user-name-barbearia/${barbeariaId}`)
      .then(res => {
        setUserNameBarbearia(res.data.UserNameBarbearia)
      })
      .catch(error => console.log(error));
  }, [barbeariaId])

console.log(novoUserName)
console.log(userNameBarbearia)

/*-------------------------------------------*/
  return (
    <>
    <div className="menu__main" onClick={alternarNome}>
          <span className="material-symbols-outlined icon_menu">person</span>
            Nome
            <span className={`material-symbols-outlined arrow ${mostrarNome ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>
      {mostrarNome && (
            <div className="divSelected">
              <p className='information__span'>Alterar Nome de usuário</p>
              <p className="mensagem-sucesso">{messageUserName}</p>

            <div className="inputBox">
            <input
                type="text"
                id="usuario"
                name="usuario"
                maxLength={30}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres não alfanuméricos
                  const filteredValue = inputValue.replace(/[^a-zA-Z0-9.\s]/g, '');
                  // Limitar a 30 caracteres
                  const userName = filteredValue.slice(0, 30);
                setNovoUserName(userName);
                }}
                placeholder={userNameBarbearia}
                className="white-placeholder"
                required
              />{' '}<span className="material-symbols-outlined icon_input">person_edit</span>
            </div>

            <button className={`button__change ${novoUserName ? 'show' : ''}`} onClick={alterarUserName}>
              Alterar
            </button>
         </div>
         
          )}
    </>
  );
};

export default Widget;