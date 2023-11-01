import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function BarbeariaDetails() {
  const location = useLocation();
  const barbearia = location.state;
  const barbeariaId = barbearia.id;
  

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [servicos, setServicos] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

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

const handleSubmit = async () => {
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
  };

  return (
    <div>
      <h1>Detalhes da Barbearia</h1>
      <h2>{barbearia.name}</h2>
      <p>{barbearia.email}</p>
      <h3>Agendar um Serviço</h3>
      <Calendar onChange={handleDateChange} value={selectedDate}/>
      <div><br />
        <label>Horário: </label>
        <select onChange={handleTimeChange} value={selectedTime}>
          <option value="">Selecione um horário</option>
          <option value="08:00">08:00</option>
          <option value="09:00">09:00</option>
          <option value="10:00">10:00</option>
          <option value="11:00">11:00</option>
          <option value="12:00">12:00</option>
        </select>
      </div><br />
      <div>
        <label>Serviço: </label>
        <select onChange={handleServiceChange} value={selectedService}>
            <option value="">Selecione um serviço</option>
            {servicos
            .filter(servico => servico.barbearia_id === barbearia.id)
            .map(servico => (
                <option key={servico.id} value={servico.id}>{servico.name}</option>
            ))}
        </select>
        </div><br />
        <button onClick={handleSubmit} disabled={!selectedDate || !selectedTime || !selectedService}>
        Agendar
        </button>
    </div>
  );
}

export default BarbeariaDetails