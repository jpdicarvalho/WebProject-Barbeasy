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
const [intervaloSelecionado, setIntervaloSelecionado] = useState([]);
const [tempoAtendimentoSelected, setTempoAtendimentoSelected] = useState([]);
const [arrayHoraDefIntervalo, setArrayHoraDefIntervalo] = useState(null);
const [horarioDefinido, setHorarioDefinido] = useState([]);

const alternarHorario = () => {
  setMostrarHorario(!mostrarHorario);
};
const handleDiaClick = (dia) => {
  setDiaSelecionado(dia);
};
function generateHorarios(inicio, termino, intervalo) {
  const horarios = [];
  let horaAtual = inicio;

  while (horaAtual <= termino) {
    horarios.push(horaAtual);

    const totalMinutos = parseInt(horaAtual.substring(0, 2)) * 60 + parseInt(horaAtual.substring(3)) + intervalo;
    const novaHora = Math.floor(totalMinutos / 60).toString().padStart(2, '0');
    const novosMinutos = (totalMinutos % 60).toString().padStart(2, '0');
    horaAtual = `${novaHora}:${novosMinutos}`;
  }

  return horarios;
}
const horarios = generateHorarios('07:30', '22:30', 15);
// Função para lidar com a seleção de um horário
const handleHorarioFuncionamento = (horario) => {
    if (HorarioFuncionamento.length === 2 && !HorarioFuncionamento.includes(horario)) {
        // Já existem dois horários selecionados e o horário clicado não está entre eles
        return;
    }
    // Verifica se o horário já está selecionado
    if (HorarioFuncionamento.includes(horario)) {
        // Remove o horário da seleção
        setHorarioFuncionamento(HorarioFuncionamento.filter(item => item !== horario));
    } else {
        // Adiciona o horário à seleção
        setHorarioFuncionamento([...HorarioFuncionamento, horario]);
    }
};
// Função para lidar com a seleção de um horário
const handleIntervalo = (horario) => {
  if (horarioDefinido.includes(horario)) {
    // Remove o horário da seleção
    const novosIntervalos = horarioDefinido.filter(item => item !== horario);
    setHorarioDefinido(novosIntervalos);
  } else {
    // Adiciona o horário à seleção
    setHorarioDefinido([...horarioDefinido, horario]);
  }
};

// Função para lidar com a seleção de um horário
const handleAtendimento = (atendimento) => {
  if (tempoAtendimentoSelected.length === 1 && !tempoAtendimentoSelected.includes(atendimento)) {
      return;
  }
  // Verifica se o horário já está selecionado
  if (tempoAtendimentoSelected.includes(atendimento)) {
      setTempoAtendimentoSelected(tempoAtendimentoSelected.filter(item => item !== atendimento));      
  } else {
      setTempoAtendimentoSelected([...tempoAtendimentoSelected, atendimento]);
  }
};
//Função para gerar automaticamente os horários de funcionamento
useEffect(() => {
  const timeout = setTimeout(() => {
    handleHorariosDefinidos();
  }, 1000);
  return () => clearTimeout(timeout);

}, [HorarioFuncionamento, tempoAtendimentoSelected]);

//Função para gerar o período de funcionamento
const handleHorariosDefinidos = () => {
  if(HorarioFuncionamento && tempoAtendimentoSelected.length > 0){
    const tempAtendimento = parseInt(tempoAtendimentoSelected[0].split('min')[0]);
    const horariosDefinido = generateHorarios(HorarioFuncionamento[0], HorarioFuncionamento[1], tempAtendimento);
    return setHorarioDefinido(horariosDefinido)
  }
}
console.log('teste',intervaloSelecionado)
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
                      {diaSelecionado === day && horarioDefinido.length > 0 && (
                        <div>
                          <p className='information__span'>Deseja remover algum horário?</p>
                          <div className="inputs-horarios">
                            {horarioDefinido.map((horario, index) => (
                              <div
                                key={index}
                                className={`horario-item ${horarioDefinido.includes(horario) ? 'Horario-selecionado' : ''}`}
                                onClick={() => handleIntervalo(horario)}
                              >
                                <p>{horario}</p>
                              </div>
                            ))}
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