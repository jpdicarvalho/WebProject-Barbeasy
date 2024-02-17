import { useEffect, useState } from "react";
import axios from "axios";
import './widget.css';


const Widget = () => {

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
          className="days-switch" // Adicione a classe aqui
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
    const barbeariaId = 1;
    
    axios.post(`http://localhost:8000/api/update-agenda/${barbeariaId}`, {daysWeek: daysWeekSelected, qntDays: QntDaysSelected})
    .then(res => {
      if(res.data.Success === 'Success'){
        setMessageAgenda("Agenda Atualizada com Sucesso!")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgenda('');
          window.location.reload();
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
  useEffect(() => {
    const barbeariaId = 1;
    axios.get(`http://localhost:8000/api/agenda/${barbeariaId}`)
    .then(res => {
      if(res.status === 200){
        setAgenda(res.data.Agenda)
      }
    }).catch(error => {
      console.error('Erro ao buscar informações da agenda da barbearia', error)
    })
  }, [])
  //Iniciando os inputs Checked com os valores cadastrados na agenda
  useEffect(() => {
    if (Array.isArray(agenda) && agenda.length >= 2) {
      setDaysFromAgenda(agenda[0].split(','));
      setDaysWeekSelected(daysFromAgenda);
      setQntDaysSelected(agenda[1].toString());
    }
  }, [agenda]);
/*-------------------------------------------*/
const [mostrarHorario, setMostrarHorario] = useState(false);
const [diaSelecionado, setDiaSelecionado] = useState(null);
const [HorarioFuncionamento, setHorarioFuncionamento] = useState([]);
const [tempoAtendimentoSelected, setTempoAtendimentoSelected] = useState([]);
const [horarioDefinido, setHorarioDefinido] = useState([]);
const [agendaDoDiaSelecionado, setAgendaDoDiaSelecionado] = useState([]);

//Declaração dos array de horários padronizados e de cada dia da semana
const [horariosPadronizados, setHorariosPadronizados] = useState([]);
const [horariosDom, setHorariosDom] = useState([]);
const [horariosSeg, setHorariosSeg] = useState([]);
const [horariosTer, setHorariosTer] = useState([]);
const [horariosQua, setHorariosQua] = useState([]);
const [horariosQui, setHorariosQui] = useState([]);
const [horariosSex, setHorariosSex] = useState([]);
const [horariosSab, setHorariosSab] = useState([]);

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
          let arrayClear = agendaDoDiaSelecionado.splice(agendaDoDiaSelecionado[i], 1);
          return setAgendaDoDiaSelecionado(arrayClear);
      }
    }
  }
};

//Função para salvar os horários definidos para o dia selecionado
const salvarHorariosDiaSelecionado = () =>{
  const barbeariaId = 1;
  let strAgendaDiaSelecionado = agendaDoDiaSelecionado.join(',');
  
  axios.post(`http://localhost:8000/api/update-agendaDiaSelecionado/${barbeariaId}`, {StrAgenda: strAgendaDiaSelecionado})
  .then(res => {
    if(res.data.Success === 'Success'){
      setMessageAgendaHorarios("Horários Salvos com Sucesso!")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgendaHorarios('');
          window.location.reload();
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
useEffect(() => {
  const barbeariaId = 1;
  axios.get(`http://localhost:8000/api/agendaDiaSelecionado/${barbeariaId}`)
  .then(res => {
    let arrayHorariosPadrao = res.data.horariosDiaEspecifico;
    let verifyIndexArray;

    if(arrayHorariosPadrao.length > 0 && arrayHorariosPadrao[0] != null || ''){
      verifyIndexArray = arrayHorariosPadrao[0].split(',')
      if(verifyIndexArray[0] === 'horarioPadrao'){
        verifyIndexArray.shift();
        setHorariosPadronizados(verifyIndexArray);
      }
      for(let i=0; i < arrayHorariosPadrao.length; i++){
        verifyIndexArray = arrayHorariosPadrao[i].substring(0, 3)

          if (verifyIndexArray === 'Dom'){
            setHorariosDom (arrayHorariosPadrao[i].split(','));
          }
          if (verifyIndexArray === 'Seg'){
            setHorariosSeg (arrayHorariosPadrao[i].split(','));
          }
          if (verifyIndexArray === 'Ter'){
            setHorariosTer (arrayHorariosPadrao[i].split(','));
          }
          if (verifyIndexArray === 'Qua'){
            setHorariosQua (arrayHorariosPadrao[i].split(','));
          }
          if (verifyIndexArray === 'Qui'){
            setHorariosQui (arrayHorariosPadrao[i].split(','));
          }
          if (verifyIndexArray === 'Sex'){
            setHorariosSex (arrayHorariosPadrao[i].split(','));
          }
          if (verifyIndexArray === 'Sáb'){
            setHorariosSab (arrayHorariosPadrao[i].split(','));
          }
        
      }
      
    }
    
  }).catch(error => {
    console.error('Erro ao buscar informações da agenda da barbearia', error)
  })
}, [])

//Função para salvar os horários definidos para todos os dias
const salvarHorariosTodosOsDias = () =>{
  const barbeariaId = 1;

  let arrayEdited = agendaDoDiaSelecionado;
  arrayEdited[0] = 'horarioPadrao';

  let strHorariosTodosOsDias = arrayEdited.join(',');
  
  axios.post(`http://localhost:8000/api/update-horariosTodosOsDias/${barbeariaId}`, {StrAgenda: strHorariosTodosOsDias})
  .then(res => {
    if(res.data.Success === 'Success'){
      setMessageAgendaHorarios("Horários Salvos com Sucesso!")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgendaHorarios('');
          window.location.reload();
        }, 3000);
    }
  }).catch(error => {
    setMessageAgendaHorarios("Erro ao Salvar Horários, tente novamente mais tarde.")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgendaHorarios('');
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
  const horariosPorDia = {
    'Domingo': horariosDom,
    'Segunda-feira': horariosSeg,
    'Terça-feira': horariosTer,
    'Quarta-feira': horariosQua,
    'Quinta-feira': horariosQui,
    'Sexta-feira': horariosSex,
    'Sábado': horariosSab
  };

  const horariosParaRenderizar = horariosPorDia[dia];

  if (horariosParaRenderizar && horariosParaRenderizar.length > 0) {
    return horariosParaRenderizar.map((horario, index) => (
      <div className="horario-item" key={`${dia}-${index}`}>
        <p>{horario}</p>
      </div>
    ));
  } else if (horariosPadronizados.length > 0) {
    return horariosPadronizados.map((horario, index) => (
      <div className="horario-item" key={`padrao-${index}`}>
        <p>{horario}</p>
      </div>
    ));
  } else {
    return <p>Não há horários definidos para este dia.</p>;
  }
};



/*-------------------------------------------*/
  return (
    <>
      <div className="menu__main" onClick={alternarHorario}>
          <span className="material-symbols-outlined icon_menu">schedule</span>
              Definir Horários de Trabalho
              <span className={`material-symbols-outlined arrow ${mostrarHorario ? 'girar' : ''}`} id='arrow'>expand_more</span>
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
                            {messageAgendaHorarios === 'Horários Salvos com Sucesso!' ?
                              <p className="mensagem-sucesso">{messageAgendaHorarios}</p>
                                :
                              <p className="mensagem-erro">{messageAgendaHorarios}</p>
                            }
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

      <div className="menu__main" onClick={alternarDiasTrabalho}>
        <span className="material-symbols-outlined icon_menu">calendar_clock</span>
          Definir Dias de Trabalho
        <span className={`material-symbols-outlined arrow`} id='arrow'>expand_more</span>
      </div>

      {mostrarDiasSemana && (
        <div className="divSelected">
          {messageAgenda === 'Agenda Atualizada com Sucesso!' ?
                <p className="mensagem-sucesso">{messageAgenda}</p>
                  :
                <p className="mensagem-erro">{messageAgenda}</p>
              }
        <p className='information__span'>Selecione os dias da semana em que deseja trabalhar:</p>
        {diasSemana.map((dia, index) => (
          <div className="container__checkBox" key={index}>
            <span>{dia}</span>
            <Checkbox dia={dia} />
          </div>
        ))}

        <p className='information__span'>Escolha a quantidade de dias a serem disponibilizados para agendamento:</p>
        <div className="container__checkBox">
          <span>Próximos 7 dias</span>
          <CheckboxQntDias value="7" />
        </div>
        <div className="container__checkBox">
          <span>Próximos 15 dias</span>
          <CheckboxQntDias value="15" />
        </div>
        <div className="container__checkBox">
          <span>Próximos 30 dias</span>
          <CheckboxQntDias value="30" />
        </div>
        <button className={`button__change ${QntDaysSelected.length > 0 && daysWeekSelected.length > 0 ? 'show' : ''}`} onClick={updateAgenda}>
          Alterar
        </button>

      </div>
      )}
<hr />
    </>
  );
};

export default Widget;