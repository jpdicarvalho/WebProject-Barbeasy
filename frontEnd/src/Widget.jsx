import { useEffect, useState } from "react";
import axios from "axios";
import './widget.css';


const Widget = () => {
  
const [mostrarSenha, setMostrarSenha] = useState(false);
const [passwordConfirm, setPasswordConfirm] = useState('');
const [newPassword, setNewPassword] = useState('');
const [messagePassword, setMessagePassword] = useState('');

const alternarSenha = () => {
  setMostrarSenha(!mostrarSenha);
};
const alterarSenha = () => {
  const barbeariaId = 1;
  axios.get('http://localhost:8000/api/update-password-barbearia', {
    params: {
      barbeariaId: barbeariaId,
      passwordConfirm: passwordConfirm,
      newPassword: newPassword
    }
  }).then(res => {
    if(res.data.Success === 'Success'){
      setMessagePassword("Senha Alterada com Sucesso!")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessagePassword('');
          window.location.reload();
        }, 3000);
    }
  }).catch(error => {
    setMessagePassword("Senha atual não confirmada!")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessagePassword('');
          //window.location.reload();
        }, 5000);
  });
};
/*-------------------------------------------*/
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
const [horariosDia, setHorariosDia] = useState({
  manha: '',
  tarde: '',
  noite: ''
});
// Adicione esses estados ao seu componente
const [tempoAtendimento, setTempoAtendimento] = useState({
  manha: '',
  tarde: '',
  noite: ''
});
const generateTempoAtendimentoOptions = () => {
  const opcoesTempo = [
    { value: "30", label: "30 minutos" },
    { value: "60", label: "1 hora" },
    { value: "90", label: "1 hora e 30 minutos" },
    // Adicione mais opções conforme necessário
  ];

  return opcoesTempo.map((opcao) => (
    <option key={opcao.value} value={opcao.value}>
      {opcao.label}
    </option>
  ));
};

const alternarHorario = () => {
  setMostrarHorario(!mostrarHorario);
};

const handleDiaClick = (dia) => {
  setDiaSelecionado(dia);
};

const handleHorariosSubmit = () => {
  console.log('Horários submetidos:', horariosDia);
};
const generateHorarioOptions = (inicio, fim, intervalo) => {
  const options = [];
  let horaAtual = inicio;

  while (horaAtual <= fim) {
    options.push(
      <option key={horaAtual} value={horaAtual}>
        {horaAtual}
      </option>
    );

    const [horas, minutos] = horaAtual.split(':');
    const totalMinutos = parseInt(horas) * 60 + parseInt(minutos) + parseInt(intervalo);
    const novaHora = Math.floor(totalMinutos / 60).toString().padStart(2, '0');
    const novosMinutos = (totalMinutos % 60).toString().padStart(2, '0');
    horaAtual = `${novaHora}:${novosMinutos}`;
  }

  return options;
};

/*-------------------------------------------*/
  return (
    <>
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

<div className="menu__main" onClick={alternarHorario}>
          <span className="material-symbols-outlined icon_menu">schedule</span>
              Definir Horários de Trabalho
              <span className={`material-symbols-outlined arrow ${mostrarHorario ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>

          {mostrarHorario && (
            <div className="divSelected">
              <p className='information__span'>Defina os horários de atendimento para cada dia definido anteriormente:</p>
              {daysFromAgenda.length === 0 ? (
                <p style={{textAlign: 'center', marginTop: '10px'}}>Nenhum dia selecionado</p>
              ) : (
                daysFromAgenda.map(day => (
                  <div key={day} className='Dias_Trabalho_Rapido'>
                    <div className='Dias_Semana' onClick={() => handleDiaClick(day)}>{day}
                    <p className='information__span'>Início do Expediente</p>
                    {diaSelecionado === day && (
                      <div className="inputs-horarios">
                        <select className='inputSelect' value={horariosDia.manha} onChange={(e) => setHorariosDia({ ...horariosDia, manha: e.target.value })}>
                          <option value="">Manhã</option>
                          {generateHorarioOptions('07:00', '08:30', 15)}
                        </select>
                        <select className='inputSelect' value={horariosDia.tarde} onChange={(e) => setHorariosDia({ ...horariosDia, tarde: e.target.value })}>
                        <option value="">Tarde</option>
                          {generateHorarioOptions('13:00', '14:30', 15)}
                        </select>
                        <select className='inputSelect' value={horariosDia.noite} onChange={(e) => setHorariosDia({ ...horariosDia, noite: e.target.value })}>
                        <option value="">Noite</option>
                          {generateHorarioOptions('18:30', '19:30', 15)}
                        </select>
                      </div>
                    )}
                    <p className='information__span'>Tempo de atendimento</p>
                      <select className='inputSelect' value={tempoAtendimento.manha} onChange={(e) => setTempoAtendimento({ ...tempoAtendimento, manha: e.target.value })}>
                        <option value="">Manhã</option>
                        {generateTempoAtendimentoOptions()}
                      </select>
                      <select className='inputSelect' value={tempoAtendimento.tarde} onChange={(e) => setTempoAtendimento({ ...tempoAtendimento, tarde: e.target.value })}>
                        <option value="">Tarde</option>
                        {generateTempoAtendimentoOptions()}
                      </select>
                      <select className='inputSelect' value={tempoAtendimento.noite} onChange={(e) => setTempoAtendimento({ ...tempoAtendimento, noite: e.target.value })}>
                        <option value="">Noite</option>
                        {generateTempoAtendimentoOptions()}
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
<hr />
      <div className="menu__main" onClick={alternarSenha}>
          <span className="material-symbols-outlined icon_menu">password</span>
            Senha
            <span className={`material-symbols-outlined arrow ${mostrarSenha ? 'girar' : ''}`} id='arrow'>expand_more</span>
      </div>

<hr />
      {mostrarSenha && (
            <div className="divSelected">
              <p className='information__span'>Alterar Senha</p>
              {messagePassword === 'Senha Alterada com Sucesso!' ?
                <p className="mensagem-sucesso">{messagePassword}</p>
                  :
                <p className="mensagem-erro">{messagePassword}</p>
              }

            <div className="inputBox">
              <input
                type="password"
                id="senha"
                name="senha"
                maxLength="10"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Limitar a 10 caracteres
                  const truncatedPasswordConfirm = inputValue.slice(0, 10);
                  setPasswordConfirm(truncatedPasswordConfirm);
                }}
                placeholder="Senha Atual"
                required
                />{' '} <span className="material-symbols-outlined icon_input">lock</span>
            </div>

            <div className="inputBox">
            <input
                type="password"
                id="NovaSenha"
                name="NovaSenha"
                maxLength="10"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Limitar a 8 caracteres
                  const truncatedValue = inputValue.slice(0, 8);
                  setNewPassword(truncatedValue);
                }}
                placeholder="Nova Senha"
                required
                />{' '} <span className="material-symbols-outlined icon_input">lock_reset</span>
            </div>

            <button className={`button__change ${newPassword ? 'show' : ''}`} onClick={alterarSenha}>
              Alterar
            </button>
         </div>
         
      )}

    </>
  );
};

export default Widget;