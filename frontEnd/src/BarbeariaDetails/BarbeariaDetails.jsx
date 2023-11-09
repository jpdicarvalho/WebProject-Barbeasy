import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import logoMercadoPago from './logoMercadoPago.png'
//import Modal from 'react-modal';

import './BarbeariaDetails.css'
import imgBarbearia from './img-barbearia.jpg'

function BarbeariaDetails() {
  const location = useLocation();
  const barbearia = location.state;
  //const barbeariaId = barbearia.id;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [servicos, setServicos] = useState([]);
  const [isMenuActive, setMenuActive] = useState(false);
  const [isAgendamentoConfirmed, setAgendamentoConfirmed] = useState(false);
  //const [isModalOpen, setModalOpen] = useState(false);

  const [url,setUrl] = useState(null);
  
  

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
    fetchData();
  }, []);
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:8000/listServico');
          const data = await response.json();
          setServicos(data);
        } catch (error) {
          console.error('Erro ao obter os registros:', error);
        }
      };
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

  const handleClick = () => {
    console.log(url)
    window.open(url, 'modal');
  };

  return (
    <div className="ContainerMain">

      <div className="Header">
        <h3 id="barbDetails">Detalhes da Barbearia</h3>
        <div className="userProfile">
           <i className="fa-solid fa-user"></i>
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
    </div>
  );
}

export default BarbeariaDetails