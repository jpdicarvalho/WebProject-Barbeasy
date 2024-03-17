import { useEffect, useState } from "react";
import {motion} from 'framer-motion';
import axios from "axios";
//Icons
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineBackup } from "react-icons/md";
import { RiRadioButtonLine } from "react-icons/ri";
import { RiStore3Line } from "react-icons/ri";
import { MdOutlineAddBusiness } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdAddRoad } from "react-icons/md";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { GrMapLocation } from "react-icons/gr";
import { IoMdLocate } from "react-icons/io";
import { BsCalendar2Day } from "react-icons/bs";
import { TbClockHour4 } from "react-icons/tb";
import { GiRazor } from "react-icons/gi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { PiPassword } from "react-icons/pi";
import { PiPasswordDuotone } from "react-icons/pi";
import { MdOutlineDone } from "react-icons/md";
import { VscError } from "react-icons/vsc";


import './widget.css';


const Widget = () => {
  const barbeariaId = 1;
  /*----------------------------------*/
const [mostrarDiasSemana, setMostrarDiasSemana] = useState(false);
const [daysWeekSelected, setDaysWeekSelected] = useState([]);
const [QntDaysSelected, setQntDaysSelected] = useState([]);
const [agenda, setAgenda] = useState([]);
const [daysFromAgenda, setDaysFromAgenda] = useState([]);
const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const [messageAgenda, setMessageAgenda] = useState('');

  //Mostrando a div com os inputs Cheked
  const alternarDiasTrabalho = () => {
    setMostrarDiasSemana(!mostrarDiasSemana);
  };
  //Obtendo os valores selecionados pelo usuário
  const handleCheckboxChange = (dia) => {
    if (daysWeekSelected.includes(dia)) {
      // Se o dia já estiver selecionado, remova-o
      setDaysWeekSelected(daysWeekSelected.filter((selectedDia) => selectedDia !== dia));
    } else {
      // Se o dia não estiver selecionado, adicione-o
      setDaysWeekSelected([...daysWeekSelected, dia]);
    }
  };
  //Passando os valores para o input Dias da Semanas
  const Checkbox = ({ dia }) => {
    return (
      <>
        <input
          type="checkbox"
          id={dia}
          checked={daysWeekSelected.includes(dia)}
          onChange={() => handleCheckboxChange(dia)}
          className="days-switch" 
        />
        <label htmlFor={dia} className="switch">
          <span className="slider"></span>
        </label>
      </>
    );
  };
  //Passando os valores para o input Quantidade de dias
  const CheckboxQntDias = ({ value }) => {
    return (
      <>
        <input
          type="checkbox"
          id={value}
          checked={QntDaysSelected === value}
          onChange={() => {
            if (QntDaysSelected === value) {
              // Se a opção já estiver selecionada, desmarque-a
              setQntDaysSelected('');
            } else {
              // Caso contrário, selecione a opção
              setQntDaysSelected(value);
            }
          }}
          className="days-switch"
        />
        <label htmlFor={value} className="switch">
          <span className="slider"></span>
        </label>
      </>
    );
  };

  //Cadastrando os valores na agenda da barbearia
  const updateAgenda = () =>{
    axios.post(`http://localhost:8000/api/update-agenda/${barbeariaId}`, {daysWeek: daysWeekSelected, qntDays: QntDaysSelected})
    .then(res => {
      if(res.data.Success === 'Success'){
        setMessageAgenda("Agenda Atualizada com Sucesso!")
        setTimeout(() => {
          setMessageAgenda('');
          getAgenda()
          setMostrarDiasSemana(!mostrarDiasSemana);
        }, 3000);
      }
    }).catch(error => {
      setMessageAgenda("Não foi possível atualizar sua agenda.")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgenda('');
          window.location.reload();
        }, 3000);
      console.error('erro ao atualizar a agenda', error)
    })
  }
  //Obtendo os dados da agenda da barbearia
  const getAgenda = () =>{
    axios.get(`http://localhost:8000/api/agenda/${barbeariaId}`)
    .then(res => {
      if(res.status === 200){
        setAgenda(res.data.Agenda)
      }
    }).catch(error => {
      console.error('Erro ao buscar informações da agenda da barbearia', error)
    })
  }
  //Chamando a função para obter os dados da agenda da barbearia
  useEffect(() => {
    getAgenda()
  }, [])

  useEffect(() => {
    if (Array.isArray(agenda) && agenda.length >= 2) {
      setDaysFromAgenda(agenda[0].split(','));
      setQntDaysSelected(agenda[1].toString());
    }
  }, [agenda]);
  
  useEffect(() => {
    setDaysWeekSelected(daysFromAgenda);
  }, [daysFromAgenda]);
/*-------------------------------------------*/
const [mostrarHorario, setMostrarHorario] = useState(false);
const [diaSelecionado, setDiaSelecionado] = useState(null);
const [HorarioFuncionamento, setHorarioFuncionamento] = useState([]);
const [tempoAtendimentoSelected, setTempoAtendimentoSelected] = useState([]);
const [horarioDefinido, setHorarioDefinido] = useState([]);
const [agendaDoDiaSelecionado, setAgendaDoDiaSelecionado] = useState([]);

//Declaração dos array de horários padronizados e de cada dia da semana
const [timesDays, setTimesDays] = useState('');

const [messageAgendaHorarios, setMessageAgendaHorarios] = useState('');

//Função para alternar o estado de 'mostrarHorario' (variável booleana), responsável por mostrar os horários a serem definidos
const alternarHorario = () => {
  setMostrarHorario(!mostrarHorario);
};

//Função responsável por atualizar o estado 'diaSelecionado' com o dia que foi selecionado.
const handleDiaClick = (dia) => {
  setDiaSelecionado(dia);
};

// Função responsável por gerar uma lista de horários com base no horário de início, término e intervalo fornecidos como parâmetros.
function generateHorarios(inicio, termino, intervalo) {
  // Array para armazenar os horários gerados
  const horarios = [];
  // Inicializa a hora atual com o horário de início
  let horaAtual = inicio;

  // Loop para gerar os horários até alcançar o horário de término
  while (horaAtual <= termino) {
      // Adiciona o horário atual ao array de horários
      horarios.push(horaAtual);

      // Calcula o total de minutos
      const totalMinutos = parseInt(horaAtual.substring(0, 2)) * 60 + parseInt(horaAtual.substring(3)) + intervalo;
      // Calcula a nova hora e os novos minutos com base no total de minutos
      const novaHora = Math.floor(totalMinutos / 60).toString().padStart(2, '0');
      const novosMinutos = (totalMinutos % 60).toString().padStart(2, '0');
      // Atualiza a hora atual para o próximo horário
      horaAtual = `${novaHora}:${novosMinutos}`;
  }
  // Retorna a lista de horários gerados
  return horarios;
}

//Esta linha gera os horários com base nos parâmetros fornecidos
const horarios = generateHorarios('07:30', '22:30', 15);

// Função responsável por adicionar ou remover o horário selecionado
const handleHorarioFuncionamento = (horario) => {
  // Verifica se já existem dois horários selecionados e se o horário clicado não está entre eles
  if (HorarioFuncionamento.length === 2 && !HorarioFuncionamento.includes(horario)) {
      // Caso positivo, não faz nada e retorna
      return;
  }
  
  // Verifica se o horário já está selecionado
  if (HorarioFuncionamento.includes(horario)) {
      // Se o horário já estiver selecionado, remove-o da seleção
      setHorarioFuncionamento(HorarioFuncionamento.filter(item => item !== horario));
  } else {
      // Se o horário não estiver selecionado, adiciona-o à seleção
      setHorarioFuncionamento([...HorarioFuncionamento, horario]);
  }
};

// Função para definir o tempo de atendimento
const handleAtendimento = (atendimento) => {
  // Verifica se já há um tempo de atendimento selecionado e se o tempo atual não está incluído nele
  if (tempoAtendimentoSelected.length === 1 && !tempoAtendimentoSelected.includes(atendimento)) {
      // Se sim, não faz nada e retorna
      return;
  }

  // Verifica se o tempo de atendimento já está selecionado
  if (tempoAtendimentoSelected.includes(atendimento)) {
      // Se estiver selecionado, remove-o da seleção
      setTempoAtendimentoSelected(tempoAtendimentoSelected.filter(item => item !== atendimento));      
  } else {
      // Se não estiver selecionado, adiciona-o à seleção
      setTempoAtendimentoSelected([...tempoAtendimentoSelected, atendimento]);
  }
};

// Função para remover horários do array horarioDefinido
const handleIntervalo = (horario) => {
  // Verifica se o horário já está presente no array horarioDefinido
  if (horarioDefinido.includes(horario)) {
      // Se estiver presente, remove-o da seleção
      const novosIntervalos = horarioDefinido.filter(item => item !== horario);
      setHorarioDefinido(novosIntervalos);
  } else {
      // Se não estiver presente, adiciona-o à seleção
      setHorarioDefinido([...horarioDefinido, horario]);
  }
};

// Função para gerar o período de funcionamento
const handleHorariosDefinidos = () => {
  // Verifica se os horários de funcionamento e o tempo de atendimento estão definidos
  if (HorarioFuncionamento && tempoAtendimentoSelected.length > 0) {
      // Extrai o tempo de atendimento do formato 'Xmin' e converte para um número inteiro
      const tempAtendimento = parseInt(tempoAtendimentoSelected[0].split('min')[0]);
      
      // Gera os horários definidos com base no horário de funcionamento, tempo de atendimento e intervalo
      const horariosDefinido = generateHorarios(HorarioFuncionamento[0], HorarioFuncionamento[1], tempAtendimento);
      
      // Define os horários definidos
      return setHorarioDefinido(horariosDefinido);
  }
};

//Função para adicionar o dia selecionado e o horario definido a um novo array
const diaSelecionadoFormat = () => {
  //Adicionando o dia da semana selecionado no array de horários
  horarioDefinido.unshift(diaSelecionado);
  
  // Filtra o array horarioDefinido para remover duplicatas e armazena o resultado em uniqueArray
  let uniqueArray = horarioDefinido.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });

  //Função para formatar o nome do dia da semana
  if(uniqueArray[0]){
    uniqueArray[0] = uniqueArray[0].substring(0, 3); // Limita a string para três letras
    uniqueArray[0] = uniqueArray[0].charAt(0).toUpperCase() + uniqueArray[0].slice(1); // Transforma a primeira letra em maiúscula
    return setAgendaDoDiaSelecionado(uniqueArray);
  }
};

//Função para configurar a agenda de horários do dia selecionado
const configAgendaDiaSelecionado = () => {
  if (agendaDoDiaSelecionado && agendaDoDiaSelecionado.length > 1) {
    for (let i = 0; i < agendaDoDiaSelecionado.length; i++) {
      if (agendaDoDiaSelecionado[i] && agendaDoDiaSelecionado[i].length > 5) {
          //Salvando as iniciais do dia selecionado, no array de horários de finidos
          let arrayClear = agendaDoDiaSelecionado.splice(agendaDoDiaSelecionado[i], 1);
          return setAgendaDoDiaSelecionado(arrayClear);
      }
    }
  }
};

//Função para salvar os horários definidos para o dia selecionado
const salvarHorariosDiaSelecionado = () =>{
  let strAgendaDiaSelecionado = agendaDoDiaSelecionado.join(',');
  
  axios.post(`http://localhost:8000/api/update-agendaDiaSelecionado/${barbeariaId}`, {StrAgenda: strAgendaDiaSelecionado})
  .then(res => {
    if(res.data.Success === 'Success'){
      setMessageAgendaHorarios("Horários Salvos com Sucesso.")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgendaHorarios('');
          getHorariosDefinidos()
          setDiaSelecionado(null);
          setHorarioFuncionamento('')
          setTempoAtendimentoSelected('')
        }, 3000);
    }
  }).catch(error => {
    setMessageAgendaHorarios("Erro ao Salvar Horários, tente novamente mais tarde.")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgendaHorarios('');
          window.location.reload();
        }, 3000);
  })
}

//Função para obter os horários definidos do dia selecionado
const getHorariosDefinidos = () =>{
  axios.get(`http://localhost:8000/api/agendaDiaSelecionado/${barbeariaId}`)
  .then(res => {
    //Armazenando o objeto com todos os horários definidos
    setTimesDays(res.data.TimesDays)

  }).catch(error => {
    console.error('Erro ao buscar informações da agenda da barbearia', error)
  })
}
useEffect(() => {
  getHorariosDefinidos()
}, [])

//Função para salvar os horários definidos para todos os dias
const salvarHorariosTodosOsDias = () =>{
  //removing the index from the array as it contains the name of the selected day
  agendaDoDiaSelecionado.shift();
  let strHorariosTodosOsDias = agendaDoDiaSelecionado.join(',');
  
  axios.post(`http://localhost:8000/api/update-horariosTodosOsDias/${barbeariaId}`, {StrAgenda: strHorariosTodosOsDias})
  .then(res => {
    if(res.data.Success === 'Success'){
      setMessageAgendaHorarios("Horários Salvos com Sucesso.")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgendaHorarios('');
          getHorariosDefinidos()
          setDiaSelecionado(null);
          setHorarioFuncionamento('')
          setTempoAtendimentoSelected('')
        }, 2000);
    }
  }).catch(error => {
    setMessageAgendaHorarios("Erro ao Salvar Horários, tente novamente mais tarde.")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgendaHorarios('');
          window.location.reload()
        }, 3000);
  })
}

// useEffect para gerar automaticamente os horários de funcionamento
useEffect(() => {
  // Configura um timeout para executar handleHorariosDefinidos após 1 segundo
  const timeout = setTimeout(() => {
      handleHorariosDefinidos();
  }, 1000);
  
  // Retorna uma função de limpeza para limpar o timeout
  return () => clearTimeout(timeout);
}, [HorarioFuncionamento, tempoAtendimentoSelected]);

// useEffect para configurar a agenda do dia selecionado
useEffect(() => {
  // Executa diaSelecionadoFormat sempre que horarioDefinido ou diaSelecionado mudarem
  diaSelecionadoFormat();
}, [horarioDefinido, diaSelecionado]);

// useEffect para configurar a agenda do dia selecionado
useEffect(() => {
  // Executa diaSelecionadoFormat sempre que horarioDefinido ou diaSelecionado mudarem
  configAgendaDiaSelecionado();
}, [agendaDoDiaSelecionado]);

const getHorariosPorDia = (dia) => {
  //Deixando apenas as três primeiras letras do dia selecionado
  let nameDayFormated = dia.substring(0, 3);
  //Buscando no objeto, os horários do dia selecionado
  let arrayWithTimes = timesDays[nameDayFormated]
  //separando a string de horários por vírgula
  arrayWithTimes = arrayWithTimes.split(',');

  //Renderizando o horário do dia selecionado
  if (arrayWithTimes && arrayWithTimes.length > 0) {
    return arrayWithTimes.map((horario, index) => (
      <div className="horario-item" key={`${dia}-${index}`}>
        <p>{horario}</p>
      </div>
    ));
  } else {
    return <p>Não há horários definidos para este dia.</p>;
  }
};

/*=================================================*/
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
    axios.get(`https://api-user-barbeasy.up.railway.app/api/get-service/${barbeariaId}`)
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
      let firstService = servicos.length;
      axios.post(`https://api-user-barbeasy.up.railway.app/api/add-service/${barbeariaId}`, newServiceData)
          .then(res => {
            if (res.data.Success === "Success") {
              setMessageAddService("Serviço adicionado com sucesso.");
              obterServicos()
              setTimeout(() => {
                setMessageAddService(null);
                if(firstService === 0){
                  window.location.reload()
                }
                setNewNameService('')
                setNewPriceService('')
                setNewServiceDuration('')
                fecharExpandir()
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
      axios.post(`https://api-user-barbeasy.up.railway.app/api/update-service/${barbeariaId}`, editedService)
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
    let lastService = servicos.length;
    axios.delete(`https://api-user-barbeasy.up.railway.app/api/delete-service/${barbeariaId}/${servicoId}`)
      .then(res => {
        if (res.data.Success === "Success") {
          setMessageEditedService("Serviço apagado com sucesso.");
          setTimeout(() => {
            setMessageEditedService(null);
            if(lastService === 1){
              window.location.reload()
            }
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
  return (
    <>
      <div className="container__menu">

      <div className="menu__main" onClick={alternarDiasTrabalho}>
        <BsCalendar2Day className='icon_menu'/>
          Definir Dias de Trabalho
          <IoIosArrowDown className={`arrow ${mostrarDiasSemana ? 'girar' : ''}`} id='arrow'/>
      </div>
        
      {mostrarDiasSemana && (
      <div className="divSelected">
        {messageAgenda === 'Agenda Atualizada com Sucesso!' ?(
          <div className="mensagem-sucesso">
            <MdOutlineDone className="icon__success"/>
            <p className="text__message">{messageAgenda}</p>
          </div>
          ) : (
          <div className={` ${messageAgenda ? 'mensagem-erro' : ''}`}>
            <VscError className={`hide_icon__error ${messageAgenda ? 'icon__error' : ''}`}/>
            <p className="text__message">{messageAgenda}</p>
          </div>
          )}

      <p className='information__span'>Selecione os dias da semana em que deseja trabalhar:</p>
      {diasSemana.map((dia, index) => (
        <div className="container__checkBox" key={index}>
          <span className={daysWeekSelected.includes(dia) ? 'defined__day' : ''}>{dia}</span>
          <Checkbox dia={dia} />
        </div>
      ))}

      <p className='information__span'>Escolha a quantidade de dias a serem disponibilizados para agendamento:</p>
      <div className="container__checkBox">
        <span className={QntDaysSelected === '7' ? 'selectedOption' : ''}>Próximos 7 dias</span>
        <CheckboxQntDias value="7" />
      </div>
      <div className="container__checkBox">
        <span className={QntDaysSelected === '15' ? 'selectedOption' : ''}>Próximos 15 dias</span>
        <CheckboxQntDias value="15" />
      </div>
      <div className="container__checkBox">
        <span className={QntDaysSelected === '30' ? 'selectedOption' : ''}>Próximos 30 dias</span>
        <CheckboxQntDias value="30" />
      </div>
      <button className={`button__change ${QntDaysSelected.length > 0 && daysWeekSelected.length > 0 ? 'show' : ''}`} onClick={updateAgenda}>
        Alterar
      </button>

      </div>
      )}

      <hr className='hr_menu'/>

      <div className="menu__main" onClick={alternarHorario}>
        <TbClockHour4 className='icon_menu'/>
          Definir Horários de Trabalho
        <IoIosArrowDown className={`arrow ${mostrarHorario ? 'girar' : ''}`} id='arrow'/>
      </div>

      {mostrarHorario && (
          <div className="divSelected">
            <p className='information__span'>Defina seus horários de funcionamento para cada dia definido anteriormente:</p>
            {daysFromAgenda.length === 0 ? (
              <p style={{textAlign: 'center', marginTop: '10px'}}>Nenhum dia selecionado</p>
            ) : (
              daysFromAgenda.map(day => (
                <div key={day} className='Dias_Trabalho_Rapido'>
                  <div className='Dias_Semana' onClick={() => handleDiaClick(day)}>{day}
                    {diaSelecionado === day && (
                      <div><p className='information__span'>Defina o seu horário de funcionamento:</p>
                        <div className="inputs-horarios">
                          {horarios.map((horario, index) => (
                              <div
                                  key={index}
                                  className={`horario-item ${HorarioFuncionamento.includes(horario) ? 'Horario-selecionado' : ''}`}
                                  onClick={() => handleHorarioFuncionamento(horario)}
                              >
                                  <p>{horario}</p>
                              </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {diaSelecionado === day && (
                    <div><p className='information__span'>Defina o tempo de atendimento:</p>
                      <div className="inputs-horarios">
                        {['15min','30min','45min','60min','75min', '90min'].map((atendimento, index) => (
                            <div
                                key={index}
                                className={`horario-item ${tempoAtendimentoSelected.includes(atendimento) ? 'Horario-selecionado' : ''}`}
                                onClick={() => handleAtendimento(atendimento)}
                            >
                                <p>{atendimento}</p>
                            </div>
                        ))}
                      </div>
                      
                    </div>
                    )}
                    {diaSelecionado === day && (
                        <div>
                            <p className='information__span'>Horários já definidos para esse dia:</p>
                            <div className="inputs-horarios">
                                {/* Renderizar o array de horários correspondente */}
                                {getHorariosPorDia(day)}
                            </div>
                        </div>
                    )}
                    {diaSelecionado === day && agendaDoDiaSelecionado.length > 2 && (
                      <div>
                        <p className='information__span'>Deseja remover algum horário?</p>
                        <div className="inputs-horarios">
                            {agendaDoDiaSelecionado.map((value, index) => (
                            // Comece a partir do índice 1
                              index > 0 && (
                                <div
                                    key={index}
                                    className={`horario-item ${agendaDoDiaSelecionado.includes(value) ? 'Horario-selecionado' : ''}`}
                                    onClick={() => handleIntervalo(value)}
                                >
                                    <p>{value}</p>
                                    
                                </div>
                              )
                            ))}
                        </div>

                        {messageAgendaHorarios === 'Horários Salvos com Sucesso.' ?(
                          <div className="mensagem-sucesso">
                            <MdOutlineDone className="icon__success"/>
                            <p className="text__message">{messageAgendaHorarios}</p>
                          </div>
                          ) : (
                          <div className={` ${messageAgendaHorarios ? 'mensagem-erro' : ''}`}>
                            <VscError className={`hide_icon__error ${messageAgendaHorarios ? 'icon__error' : ''}`}/>
                            <p className="text__message">{messageAgendaHorarios}</p>
                          </div>
                        )}
        
                        <div className="container_button">
                          <button className="add_Service" onClick={salvarHorariosDiaSelecionado}>Salvar</button>
                          <button className="add_Service" onClick={salvarHorariosTodosOsDias}>Salvar para todos os outros dias</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
      )}
        <hr className='hr_menu'/>

          <div className="menu__main" onClick={alternarServico}>
            <GiRazor className='icon_menu'/>
              Profissional
            <IoIosArrowDown className={`arrow ${mostrarServico ? 'girar' : ''}`} id='arrow'/>
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
                      <RiDeleteBin6Line/>
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
      </div>
    </>
  );
};

export default Widget;
