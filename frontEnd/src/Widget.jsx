import { useEffect, useState } from "react";
import axios from "axios";
import { GiRazor } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";
import './widget.css';


const Widget = () => {
  const barbeariaId = 1;

  const [mostrarServico, setMostrarServico] = useState(false);
  const [showAddServico, setShowAddServico] = useState(false);

  const [nomeServiço, setNomeServiço] = useState('');
  const [precoServiço, setPrecoServiço] = useState('');
  const [tempoDuracao, setTempoDuracao] = useState([]);

  const [newNomeServiço, setNewNomeServiço] = useState('');
  const [newPrecoServiço, setNewPrecoServiço] = useState('');
  const [newTempoDuracao, setNewTempoDuracao] = useState([]);

  const [servicos, setServicos] = useState([]);
  const [servicoClicado, setServicoClicado] = useState(null);

  const [confirmDeleteServico, setConfirmDeleteServico] = useState(false);

  const [messageAddService, setMessageAddService] = useState('');
  const [messageChangeService, setMessageChangeService] = useState('');

  //Função para mostar o menu Serviço
  const alternarServico = () => {
    setMostrarServico(!mostrarServico);
  };

  //Função para mostar o menu Adicionar Serviço
  const ShowAddService = () => {
    setShowAddServico(true);
  };

  //Função para mostar o menu Adicionar Serviço
  const ShowService = (index) => {
    setServicoClicado(index);
  };  

  //Função para alterar o estado da variável que mostra o botão ConfirmDelete
  const showConfirmDeleteService = () => {
    setConfirmDeleteServico(!confirmDeleteServico);
  };

//Função para alterar o estado da variável que oculta o botão ConfirmDelete
  const hideConfirmDeleteService = () => {
    setConfirmDeleteServico(!confirmDeleteServico);
  };

  //Função para formartar o preço do serviço
  const formatarPreco = (valor) => {
    const numero = valor.replace(/\D/g, ''); // Remove caracteres não numéricos
    const valorFormatado = (Number(numero) / 100).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return `R$ ${valorFormatado}`;
  };

  //Função para adicionar o valor do serviço a variável definida
  const handleChangePreco = (event) => {
    const valor = event.target.value;
    // Filtrar apenas os números
    const numero = valor.replace(/\D/g, '');//Regex para aceitar apenas números no input
    setPrecoServiço(formatarPreco(numero));
    setNewPrecoServiço(formatarPreco(numero));
  };

  // Função responsável por adicionar ou remover o tempo de duração selecionado
  const handleTempoDuracao = (tempo) => {
    // Verifica se já existem dois tempos selecionados e se o tempo clicado não está entre eles
    if (tempoDuracao.length === 1 && !tempoDuracao.includes(tempo)) {
        // Caso positivo, não faz nada e retorna
        return;
      }

        // Verifica se o tempo já está selecionado
      if (tempoDuracao.includes(tempo)) {
        // Se o tempo já estiver selecionado, remove-o da seleção
        setTempoDuracao(tempoDuracao.filter(item => item !== tempo));
      } else {
          // Se o tempo não estiver selecionado, adiciona-o à seleção
          setTempoDuracao([...tempoDuracao, tempo]);
      }
  }
  //Função para cadastrar um novo serviço
  const adicionarServico = () => {
    if(nomeServiço && precoServiço && tempoDuracao[0]){
      axios.post(`http://localhost:8000/api/add-service/${barbeariaId}`, {nameService: nomeServiço, priceService: precoServiço, time: tempoDuracao[0]})
          .then(res => {
            if (res.data.Success === "Success") {
              setMessageAddService("Serviço adicionado com sucesso!");

              setTimeout(() => {
                setMessageAddService(null);
                window.location.reload()
              }, 2000);
              
            }
          })
          .catch(err => {
            setMessageAddService("Erro ao adicionar serviço!");

            setTimeout(() => {
              setMessageAddService(null);
              setShowAddServico(false);
              }, 3000);
            console.error(err);
          });
    }else{
      setMessageAddService("Preencha todos os campos!");
        setTimeout(() => {
          setMessageAddService(null);
        }, 3000);
    }
  };

  // Função responsável por adicionar ou remover o tempo de duração selecionado
  const handleNewTempoDuracao = (tempo) => {
    // Verifica se já existem dois tempos selecionados e se o tempo clicado não está entre eles
    if (newTempoDuracao.length === 1 && !newTempoDuracao.includes(tempo)) {
        // Caso positivo, não faz nada e retorna
        return;
      }

        // Verifica se o tempo já está selecionado
      if (newTempoDuracao.includes(tempo)) {
        // Se o tempo já estiver selecionado, remove-o da seleção
        setNewTempoDuracao(newTempoDuracao.filter(item => item !== tempo));
      } else {
          // Se o tempo não estiver selecionado, adiciona-o à seleção
          setNewTempoDuracao([...newTempoDuracao, tempo]);
      }
  }
  const alterarDadosServico = (servicoId) =>{

    if(newNomeServiço.length > 0 || newPrecoServiço.length > 0 || newTempoDuracao.length > 0){

      const newServico = {
        newNomeServiço,
        newPrecoServiço,
        servico_Id: servicoId,
        newTempoDuracao: newTempoDuracao[0]
      }
      axios.post(`http://localhost:8000/api/update-service/${barbeariaId}`, newServico)
          .then(res => {
            if (res.data.Success === "Success") {
              setMessageChangeService("Serviço alterado com sucesso!");
              setTimeout(() => {
                setMessageChangeService(null);
                window.location.reload()
              }, 3000);
              
            }
          })
          .catch(err => {
            console.log("Erro ao alterar informação do serviço.", err);
          });
    }else{
      setMessageChangeService("Nenhuma alteração identificada.");
      setTimeout(() => {
         setMessageChangeService(null);
      }, 2000);
    }
  }

  //Função para apagar um serviço
  const deleteServico = (servicoId) => {
    axios.delete(`http://localhost:8000/api/delete-service/${barbeariaId}/${servicoId}`)
      .then(res => {
        if (res.data.Success === "Success") {
          setMessageChangeService("Serviço apagado com sucesso!");
          setTimeout(() => {
            setMessageChangeService(null);
            window.location.reload()
          }, 2000);

        }
      })
      .catch(err => {
        console.log("Erro ao apagar o serviço.", err);
        setMessageChangeService("Erro ao apagar o serviço.");
          setTimeout(() => {
            setMessageChangeService(null);
          }, 2000);
      });
  }
  //Função para buscar os serviços cadastrados
  useEffect(() => {
    axios.get(`http://localhost:8000/api/get-service/${barbeariaId}`)
    .then(res => {
      if (res.data.Success === "Success") {
        setServicos(res.data.result);
      }
    })
    .catch(err => {
      setMessageAddService("Erro ao adicionar serviço!");

      setTimeout(() => {
        setMessageAddService(null);
        setShowAddServico(false);
        }, 3000);
      console.error(err);
    });
  }, []);

//Função para fechar o menu Adicionar Serviço
const fecharExpandir = () => {
  setShowAddServico(false);
};

// Adiciona um event listener para detectar cliques fora da div expandir
useEffect(() => {
  const handleOutsideClick = (event) => {
    const expandirDiv = document.querySelector('.expandir');

    if (expandirDiv && !expandirDiv.contains(event.target)){
      fecharExpandir();
    }
  };

  document.addEventListener('mousedown', handleOutsideClick);

  // Remove o event listener quando o componente é desmontado
  return () => {
    document.removeEventListener('mousedown', handleOutsideClick);
  };
}, []);

  return (
    <>

      <div className="menu__main">
          <span className="material-symbols-outlined icon_menu">schedule</span>
              Definir Horários de Trabalho
              <span className="material-symbols-outlined arro" id='arrow'>expand_more</span>
      </div>

      <div className="menu__main" onClick={alternarServico}>
        <span className="material-symbols-outlined icon_menu"/><GiRazor className="icon_menu"/>
        Definir Serviços
        <IoIosArrowDown className={`arrow ${mostrarServico ? 'girar' : ''}`} id="arrow"/>

      </div>

      {mostrarServico && (
         <div className={`${showAddServico ? 'expandir' : ''}`}>
          {showAddServico &&(
            <div className="input_Container">

                  <p>Qual o nome do serviço?</p>
                  <input
                  className="input_AddService"
                  type="text"
                  id="serviceName"
                  name="serviceName"
                  maxLength={30}
                  onChange={e => setNomeServiço(e.target.value)}
                  placeholder='Ex. Corte Social'
                  />

                  <p>Quanto vai custar?</p>
                  <input
                  className="input_AddService"
                  type="text"
                  id="precoServico"
                  name="precoServico"
                  value={precoServiço}
                  onChange={handleChangePreco}
                  maxLength={9}
                  placeholder="R$ 00,00"
                  required
                />

                  <p style={{marginTop: '10px'}}>Qual o tempo de duração?</p>
                  <div className="inputs-horarios">
                    {['15min','30min','45min','60min','75min', '90min'].map((tempo, index) => (
                      <div
                        key={index}
                        className={`horario-item ${tempoDuracao.includes(tempo) ? 'Horario-selecionado' : ''}`}
                        onClick={() => handleTempoDuracao(tempo)}
                      >
                        <p>{tempo}</p>
                      </div>
                    ))}
                  </div>
                  {messageAddService === "Serviço adicionado com sucesso!" ? (
                      <p className="mensagem-sucesso">{messageAddService}</p>
                      ) : (
                      <p className="mensagem-erro">{messageAddService}</p>
                  )}
                    <button className="button__Salve__Service" onClick={adicionarServico}>
                    Adicionar Serviço
                  </button>
            </div>
          )}
          <div className="divSelected">
            <div className='container__servicos'>
              <div className='section__service'>
              {servicos.length > 0 ?
                servicos.map((servico, index) => (
                  <div 
                  key={index}
                  className={`box__service ${servicoClicado === index ? 'expandir__Service' : ''}`}
                  onClick={() => ShowService(index)}
                >
                  <p style={{marginBottom: '10px'}}>{servico.name}</p>
                  
                  <p>Deseja alterar o nome do serviço?</p>
                  <input
                  className="input_AddService"
                  type="text"
                  id="AlterServiceName"
                  name="AlterServiceName"
                  maxLength={30}
                  onChange={e => setNewNomeServiço(e.target.value)}
                  placeholder={servico.name}
                  />

                  <p>Deseja alterar o preço do serviço?</p>
                  <input
                  className="input_AddService"
                  type="text"
                  id="AlterPrecoServico"
                  name="AlterPrecoServico"
                  value={precoServiço}
                  onChange={handleChangePreco}
                  maxLength={9}
                  placeholder={servico.preco}
                />

                <p style={{marginTop: '10px'}}>Deseja alterar o tempo de duração?</p>
                  <div className="inputs-horarios">
                    {['15min','30min','45min','60min','75min', '90min'].map((tempo, index) => (
                      <div
                        key={index}
                        className={`horario-item ${newTempoDuracao.includes(tempo) ? 'Horario-selecionado' : ''}`}
                        onClick={() => handleNewTempoDuracao(tempo)}
                      >
                        <p>{tempo}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{marginTop: '10px'}}>Duração Atual • {servico.duracao}</p>
                  {messageChangeService === "Serviço alterado com sucesso!" ? (
                      <p className="mensagem-sucesso">{messageChangeService}</p>
                      ) : (
                      <p className="mensagem-erro">{messageChangeService}</p>
                  )}
                
                  <div className="section__service__button">
                    <button className={`button_ocult ${confirmDeleteServico ? 'section__confirm__delete' : ''}`} onClick={() => deleteServico(servico.id)}>
                      Confirmar
                    </button>

                    <button className={`buttonChange__service ${confirmDeleteServico ? 'button_ocult' : ''}`} onClick={() => alterarDadosServico(servico.id)}>
                      Alterar
                    </button>

                    <button className={`delete__Service ${confirmDeleteServico ? 'button_ocult' : ''}`} onClick={showConfirmDeleteService}>
                      Excluir
                    </button>

                    <button className={`button_ocult ${confirmDeleteServico ? 'section__cancel' : ''}`} onClick={hideConfirmDeleteService}>
                      Cancelar
                    </button>

                  </div>

                </div>
                )):
                <p>Nenhum serviço cadastrado</p>
              }
              </div>
            </div>

            <button className="button__Salve__Service" onClick={ShowAddService}>
                    Adicionar Serviço
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Widget;
