import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import logoMercadoPago from './logoMercadoPago.png'
import imgUserDefault from './img-user-default.jpg'
import barberLogo from './barber-logo.png';

//import Modal from 'react-modal';

import './BarbeariaDetails.css'
import imgBarbearia from './img-barbearia.jpg'

function BarbeariaDetails() {
  
const location = useLocation();
const barbearia = location.state;

const [selectedDate, setSelectedDate] = useState(new Date());
const [selectedTime, setSelectedTime] = useState("");
const [selectedService, setSelectedService] = useState("");
const [servicos, setServicos] = useState([]);
const [isMenuActive, setMenuActive] = useState(false);
const [isAgendamentoConfirmed, setAgendamentoConfirmed] = useState(false);
const [url, setUrl] = useState(null);
const [avaliacao, setAvaliacao] = useState(0.5);
const [comentario, setComentario] = useState("");
const [AllAvaliation, setAllAvaliation] = useState([]);

  
const handleDateChange = (date) => {
    setSelectedDate(date);
};  
const handleTimeChange = (horario) => {
    setSelectedTime(horario);
};
const handleServiceChange = (servicoId) => {
    setSelectedService(servicoId);
};
const handleMenuClick = () => {
      setMenuActive(!isMenuActive);
}
//buscando o serviço cadastrado pela barbearia
useEffect(() => {  
  const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:8000/listServico');
            const data = await response.json();
            setServicos(data);
          } catch (error) {
            console.error('Erro ao obter os registros:', error);
          }
  };
fetchData();
  }, []);
/*const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/agendamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedDate,
          selectedTime,
          selectedService,
          barbeariaId
        }),
        
      });
      
      const data = await response.json();
      alert(data.message);
      window.location.href = 'http://localhost:5173/Checkout';
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
  };*/
const handleSubmit = async () => {
    try {
      // Encontrar o serviço selecionado no array de serviços
      const servicoSelecionado = servicos.find(servico => servico.id === selectedService);
      //Passando o nome da barbearia selecionada para a descrição da compra
      const DescricaoServico = `Agendamento de serviço para a barbearia ${barbearia.name}`;

      const response = await fetch('http://localhost:8000/Checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          DescricaoServico,
          preco: servicoSelecionado.preco,
          nameServico: servicoSelecionado.name
        }),
        
      });

      const json=await response.json();
      setUrl(json);
      setAgendamentoConfirmed(true);
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
};
//passando a url do mercado pago para abrir em outra aba
const handleClick = () => {
    window.open(url, 'modal');
};
// Cadastrando a avaliação/comentário do usuário do usuário
  const enviarAvaliacao = async () => {
    try {
      const response = await fetch('http://localhost:8000/avaliacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          barbeariaId: barbearia.id,
          avaliacao,
          comentario,
          data_avaliacao: new Date()
        }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Erro ao enviar a avaliação:', error);
    }
};
//Buscar as avaliações da barbearia em especifico
useEffect(() => {
    const SearchAvaliation = async () => {
      try {
        const response = await fetch('http://localhost:8000/SearchAvaliation');
        const data = await response.json();
        setAllAvaliation(data);
      } catch (error) {
        console.error('Erro ao obter os registros:', error);
      }
    };
    SearchAvaliation();
}, []);
//Numero de avaliações no total
const totalAvaliacoes = () =>{
  const totalAvaliacoes = AllAvaliation.length;
  return totalAvaliacoes;
}
// Calcula a média das avaliações apenas para a barbearia selecionada
const calcularMediaAvaliacoes = () => {
  // Filtra as avaliações apenas para a barbearia selecionada
  const avaliacoesDaBarbearia = AllAvaliation.filter(avaliacao => avaliacao.barbearia_id === barbearia.id);

  if (avaliacoesDaBarbearia.length === 0) {
    return "0,0"; // Retorna "0,0" se não houver avaliações
  }

  const somaNotas = avaliacoesDaBarbearia.reduce((soma, avaliacao) => soma + avaliacao.estrelas, 0);
  const media = somaNotas / avaliacoesDaBarbearia.length;

  return media.toFixed(1).replace('.', ',');
};
  return (
    <div className="ContainerMain">

      <div className="Header">
        <img src={barberLogo} alt="" id="logo-Barbeasy"/>
      <h3 id="barbDetails">Agendar Serviço</h3>
        <div className="userProfile">
          <img src={imgUserDefault} alt="foto de perfil do usuário" />
        </div>
      </div>

      <div className="Outdoor">
      <div className="BarbeariaInformation">
          {barbearia.status === "Aberto" ? <p className="abertoBarbDetails">{barbearia.status}</p> : <p className="fechadoBarbDetails">{barbearia.status}</p>}
          <h3 id="BarbeariaName">{barbearia.name}</h3>
         <p>{barbearia.endereco}</p>
        </div>
        <div className="imgOutdoor">
            <img src={imgBarbearia } alt="foto-barbearia" id="imgBarbearia" />
        </div>
      </div>
      
      <div className="EscolhaDia">
        <h3>Escolha um dia de sua preferência</h3>
        <Calendar id="Calendario"
          onChange={handleDateChange}
          value={selectedDate}
        />
      </div>

      <h2>Horários Disponíveis</h2>
      <span>Manhã</span>
      <div className="Horarios">
          {["08:00", "09:00", "10:00", "11:00", "12:00"].map(horario => (
            <div key={horario} onClick={() => handleTimeChange(horario)} className={`horarioDiv ${selectedTime === horario ? 'selected' : ''}`}>
              {horario}
            </div>
          ))}
        </div>
        <span>Tarde</span>
        <div className="Horarios">
          {["13:00", "14:00", "15:00", "16:00", "17:00"].map(horario => (
            <div key={horario} onClick={() => handleTimeChange(horario)} className={`horarioDiv ${selectedTime === horario ? 'selected' : ''}`}>
              {horario}
            </div>
          ))}
        </div>
        
        <h2>Serviços Disponíveis</h2>
        <div className="Servicos">
          {servicos
            .filter(servico => servico.barbearia_id === barbearia.id)
            .map(servico => (
              <div key={servico.id} onClick={() => handleServiceChange(servico.id)} className={`servicoDiv ${selectedService === servico.id ? 'selected' : ''}`}>
                {servico.name}
              </div>
          ))}
        </div>

        {!isAgendamentoConfirmed && (
            <button
            id="AgendamentoButton"
            onClick={handleSubmit}
            disabled={!selectedDate || !selectedTime || !selectedService}
          >
            Confirmar meu Agendamento
          </button>
        )}
       
       {isAgendamentoConfirmed && (
          <button onClick={handleClick} className="mercadoPagoButton">
          <img src={logoMercadoPago} alt="logo Mercado Pago" className="mercadoPagoLogo" />
          Pagar com Mercado Pago
        </button>
        )}
        
        <ul className={`Navigation glassmorphism ${isMenuActive ? 'active' : ''}`}>
              <li><a href="#"><i className="fa-solid fa-user"></i></a></li>
              <li><a href="http://localhost:5173/"><i className="fa-solid fa-house"></i></a></li>
              <li><a href="http://localhost:5173/SignIn"><i className="fa-solid fa-right-from-bracket"></i></a></li>
              <button onClick={handleMenuClick} className="toggleMenu glassmorphism"></button>
            </ul>
            <div className="AvaliacaoSection">
              <h2>Avalie esta barbearia</h2>
              <div className="Estrelas">
                {[1, 2, 3, 4, 5].map((estrela) => (
                  <span
                    key={estrela}
                    className={`fa fa-solid fa-star${avaliacao >= estrela ? ' selected' : ''}`}
                    onClick={() => setAvaliacao(estrela)}
                  ></span>
                ))}
              </div>
              <textarea
                placeholder="Deixe um comentário..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              ></textarea>
              <button onClick={enviarAvaliacao}>Enviar Avaliação</button>
            </div>

            <h2>Classificação e Avaliações</h2>
            <div className="classificacao">
              <h2>{calcularMediaAvaliacoes()}</h2>
            <h2>comentários</h2>
            {AllAvaliation
            .filter(avaliacoes => avaliacoes.barbearia_id === barbearia.id)
            .map(avaliacoes => (
              <div key={avaliacoes.id} >
                {avaliacoes.comentarios}
              </div>
          ))}
          </div>
    </div>
  );
}

export default BarbeariaDetails