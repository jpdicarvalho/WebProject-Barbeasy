import { useEffect, useState } from "react";
import axios from "axios";
import { GiRazor } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineDone } from "react-icons/md";
import { VscError } from "react-icons/vsc";


import './widget.css';


const Widget = () => {
  const barbeariaId = 1;

/*===== Functions for all functions ======*/
//Função para mostar o menu Serviço
const [mostrarServico, setMostrarServico] = useState(false);
const [servicos, setServicos] = useState([]);

  //Função para mostra os serviços cadastrados
  const alternarServico = () => {
    setMostrarServico(!mostrarServico);
  };

  //Função para buscar os serviços cadastrados
  const obterServicos = () =>{
    axios.get(`http://localhost:8000/api/get-service/${barbeariaId}`)
  .then(res => {
    if (res.data.Success === "Success") {
      setServicos(res.data.result);
    }
  })
  .catch(err => {
    console.error("Erro ao buscar serviços!", err);
  });
  }

  //hook para chamar a função de obtersServiço
  useEffect(() => {
    obterServicos()
  }, []);

//Função para formartar o preço do serviço
const formatarPreco = (valor) => {
  const numero = valor.replace(/\D/g, ''); // Remove caracteres não numéricos
  const valorFormatado = (Number(numero) / 100).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  return `R$ ${valorFormatado}`;
};
/*===== Section to add a new service ======*/
  const [showAddServico, setShowAddServico] = useState(false);

  const [newNameService, setNewNameService] = useState('');
  const [newPriceService, setNewPriceService] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState([]);

  const [messageAddService, setMessageAddService] = useState('');

  //Função para mostar o menu Adicionar Serviço
  const ShowAddService = () => {
    setShowAddServico(true);
  };
  //Função para fechar o menu Adicionar Serviço
  const fecharExpandir = () => {
    setShowAddServico(false);
  };

  //Função para adicionar o valor do serviço a variável definida
  const AddNewPriceService = (event) => {
    const valor = event.target.value;
    // Filtrar apenas os números
    const numero = valor.replace(/\D/g, '');//Regex para aceitar apenas números no input
    setNewPriceService(formatarPreco(numero));
  };

  // Função responsável por adicionar ou remover o novo tempo de duração do serviço a ser cadastrado
  const handleNewServiceDuration = (tempo) => {
  // Verifica se já existem dois tempos selecionados e se o tempo clicado não está entre eles
  if (newServiceDuration.length === 1 && !newServiceDuration.includes(tempo)) {
      // Caso positivo, não faz nada e retorna
      return;
    }

      // Verifica se o tempo já está selecionado
    if (newServiceDuration.includes(tempo)) {
      // Se o tempo já estiver selecionado, remove-o da seleção
      setNewServiceDuration(newServiceDuration.filter(item => item !== tempo));
    } else {
        // Se o tempo não estiver selecionado, adiciona-o à seleção
        setNewServiceDuration([...newServiceDuration, tempo]);
    }
  }

  //Função para cadastrar um novo serviço
  const addNewService = () => {
    // Verifica se os campos obrigatórios estão preenchidos
    if(newNameService && newPriceService && newServiceDuration[0]){
      // Cria um objeto com os dados do serviço a serem enviados
      const newServiceData = {
        newNameService,
        newPriceService,
        newDuration: newServiceDuration[0]
      };

      axios.post(`http://localhost:8000/api/add-service/${barbeariaId}`, newServiceData)
          .then(res => {
            if (res.data.Success === "Success") {
              setMessageAddService("Serviço adicionado com sucesso.");
              obterServicos()
              setTimeout(() => {
                //setMessageAddService(null);
                setNewNameService('')
                setNewPriceService('')
                setNewServiceDuration('')
                //fecharExpandir()
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
      setMessageAddService("Preencha todos os campos.");
        setTimeout(() => {
          setMessageAddService(null);
        }, 3000);
    }
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

/*===== Section to edit a current service ======*/
//Função para mostar o menu de edição de um serviço
  const [selectedService, setSelectedService] = useState(null);

  const [editedServiceName, setEditedServiceName] = useState('');
  const [editedServicePrice, setEditedServicePrice] = useState('');
  const [editedServiceDuration, setEditedServiceDuration] = useState([]);

  const [messageEditedService, setMessageEditedService] = useState('');

  //Função para mostrar o menu de edição de um serviço selecionado
  const ShowServiceEditMenu = (index) => {
    setSelectedService(index);
  }; 

  //Função para adicionar o preço editado do serviço, a variável definida
  const handleEditedServicePrice = (event) => {
    const valor = event.target.value;
    // Filtrar apenas os números
    const numero = valor.replace(/\D/g, '');//Regex para aceitar apenas números no input
    setEditedServicePrice(formatarPreco(numero));
  };

  // Função responsável por adicionar ou remover o tempo de duração selecionado, no menu de edição do serviço
  const handleEditedServiceDuration = (timeDurationEdited) => {
    // Verifica se já existem dois tempos selecionados e se o tempo clicado não está entre eles
    if (editedServiceDuration.length === 1 && !editedServiceDuration.includes(timeDurationEdited)) {
        // Caso positivo, não faz nada e retorna
        return;
      }

        // Verifica se o tempo já está selecionado
      if (editedServiceDuration.includes(timeDurationEdited)) {
        // Se o tempo já estiver selecionado, remove-o da seleção
        setEditedServiceDuration(editedServiceDuration.filter(item => item !== timeDurationEdited));
      } else {
          // Se o tempo não estiver selecionado, adiciona-o à seleção
          setEditedServiceDuration([...editedServiceDuration, timeDurationEdited]);
      }
  }
  //Função para enviar as informações do serviço alterado
  const changeServiceData = (servicoId) => {
    // Verifica se os campos obrigatórios estão preenchidos
    if (editedServiceName || editedServicePrice || editedServiceDuration[0]) {
      // Cria um objeto com os dados do serviço a serem enviados
      const editedService = {
        editedServiceName,
        editedServicePrice,
        servico_Id: servicoId,
        editedDuration: editedServiceDuration[0]
      };
      axios.post(`http://localhost:8000/api/update-service/${barbeariaId}`, editedService)
      .then(res => {
        if (res.data.Success === "Success") {
          setMessageEditedService("Serviço alterado com sucesso.");
          obterServicos()
          setTimeout(() => {
            setMessageEditedService(null);
            setEditedServiceName('')
            setEditedServicePrice('')
            setEditedServiceDuration('')
            setSelectedService(null)
          }, 2000);
        }
      })
      .catch(err => {
        console.log("Erro ao alterar informação do serviço.", err);
      });
  } else {
    setMessageEditedService("Nenhuma alteração identificada.");
    setTimeout(() => {
       setMessageEditedService(null);
    }, 2000);
  }
  }

/*===== Section to delete a current service ======*/
  const [confirmDeleteServico, setConfirmDeleteServico] = useState(false);

  //Função para alterar o estado da variável que mostra o botão ConfirmDelete
  const showConfirmDeleteService = () => {
    setConfirmDeleteServico(!confirmDeleteServico);
  };

  //Função para alterar o estado da variável que oculta o botão ConfirmDelete
  const hideConfirmDeleteService = () => {
    setConfirmDeleteServico(!confirmDeleteServico);
  };

  //Função para apagar um serviço
  const deleteServico = (servicoId) => {
    axios.delete(`http://localhost:8000/api/delete-service/${barbeariaId}/${servicoId}`)
      .then(res => {
        if (res.data.Success === "Success") {
          setMessageEditedService("Serviço apagado com sucesso.");
          setTimeout(() => {
            setMessageEditedService(null);
            obterServicos()
            setConfirmDeleteServico(false);
            setSelectedService(null)
          }, 2000);
        }
      })
      .catch(err => {
        console.log("Erro ao apagar o serviço.", err);
        setMessageEditedService("Erro ao apagar o serviço.");
        setTimeout(() => {
          setMessageEditedService(null);
        }, 2000);
      });
  }
/*=================================================*/

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
                  onChange={e => setNewNameService(e.target.value)}
                  placeholder='Ex. Corte Social'
                  />

                  <p>Quanto vai custar?</p>
                  <input
                  className="input_AddService"
                  type="text"
                  id="precoServico"
                  name="precoServico"
                  value={newPriceService}
                  onChange={AddNewPriceService}
                  maxLength={9}
                  placeholder="R$ 00,00"
                  required
                />

                  <p style={{marginTop: '10px'}}>Qual o tempo de duração?</p>
                  <div className="inputs-horarios">
                    {['15min','30min','45min','60min','75min', '90min'].map((tempo, index) => (
                      <div
                        key={index}
                        className={`horario-item ${newServiceDuration.includes(tempo) ? 'Horario-selecionado' : ''}`}
                        onClick={() => handleNewServiceDuration(tempo)}
                      >
                        <p>{tempo}</p>
                      </div>
                    ))}
                  </div>
                  {messageAddService === "Serviço adicionado com sucesso." ? (
                    <div className="mensagem-sucesso">
                      <MdOutlineDone className="icon__success"/>
                      <p className="text__message">{messageAddService}</p>
                    </div>
                      ) : (
                      <div className={` ${messageAddService ? 'mensagem-erro' : ''}`}>
                        <VscError className={`hide_icon__error ${messageAddService ? 'icon__error' : ''}`}/>
                        <p className="text__message">{messageAddService}</p>
                    </div>
                  )}
                    <button className="button__Salve__Service" onClick={addNewService}>
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
                  className={`box__service ${selectedService === index ? 'expandir__Service' : ''}`}
                  onClick={() => ShowServiceEditMenu(index)}
                >
                  <p style={{marginBottom: '10px', width: '100%'}}>{servico.name}</p>

                  <p>Deseja alterar o nome do serviço?</p>
                  <input
                  className="input_AddService"
                  type="text"
                  id="EditedServiceName"
                  name="EditedServiceName"
                  maxLength={30}
                  onChange={e => setEditedServiceName(e.target.value)}
                  placeholder={servico.name}
                  />

                  <p>Deseja alterar o preço do serviço?</p>
                  <input
                  className="input_AddService"
                  type="text"
                  id="EditedServicePrice"
                  name="EditedServicePrice"
                  value={editedServicePrice}
                  onChange={handleEditedServicePrice}
                  maxLength={9}
                  placeholder={servico.preco}
                />

                <p style={{marginTop: '10px'}}>Deseja alterar o tempo de duração?</p>
                  <div className="inputs-horarios">
                    {['15min','30min','45min','60min','75min', '90min'].map((timeDurationEdited, index) => (
                      <div
                        key={index}
                        className={`horario-item ${editedServiceDuration.includes(timeDurationEdited) ? 'Horario-selecionado' : ''}`}
                        onClick={() => handleEditedServiceDuration(timeDurationEdited)}
                      >
                        <p>{timeDurationEdited}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{marginTop: '10px'}}>Duração Atual • {servico.duracao}</p>
                  {messageEditedService === "Nenhuma alteração identificada." ? (
                    <div className={` ${messageEditedService ? 'mensagem-erro' : ''}`}>
                      <VscError className={`hide_icon__error ${messageEditedService ? 'icon__error' : ''}`}/>
                      <p className="text__message">{messageEditedService}</p>
                    </div>
                      ) : (
                      <div className={`hide__message ${messageEditedService ? 'mensagem-sucesso' : ''}`}>
                        <MdOutlineDone className="icon__success"/>
                        <p className="text__message">{messageEditedService}</p>
                      </div>
                  )}
                
                  <div className="section__service__button">
                    <button className={`button_ocult ${confirmDeleteServico ? 'section__confirm__delete' : ''}`} onClick={() => deleteServico(servico.id)}>
                      Confirmar
                    </button>

                    <button className={`buttonChange__service ${confirmDeleteServico ? 'button_ocult' : ''}`} onClick={() => changeServiceData(servico.id)}>
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
