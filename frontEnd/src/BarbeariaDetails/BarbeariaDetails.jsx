import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
//import Calendar from 'react-calendar';
import logoMercadoPago from './logoMercadoPago.png'
import { Calendar } from '../Calendar/Calendar';
import './BarbeariaDetails.css'
import imgBarbearia from './img-barbearia.jpg'
import barbeLogo from './barber-logo.png'

function BarbeariaDetails() {
  
const location = useLocation();
const { barbearia } = location.state;
const navigate = useNavigate();

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

//Função para selecionar a data escolhida pelo usuário
const handleDateChange = (date) => {
    setSelectedDate(date);
};

//Função para selecionar a hora escolhida pelo usuário
const handleTimeChange = (horario) => {
    setSelectedTime(horario);
};

//Função para selecionar o serviço escolhida pelo usuário
const handleServiceChange = (servicoId) => {
    setSelectedService(servicoId);
};

//Ativação do menu principal
const handleMenuClick = () => {
      setMenuActive(!isMenuActive);
}
// Função para navegar de volta à página inicial com dados do usuário
const navigateBackToHome = () => {
  navigate('/Home');
};

//Função LogOut
const logoutClick = () => {
  localStorage.removeItem('token');
  navigate("/SignIn");
};

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

//Mandan a requisição para a rota de Pagamento
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

//Numero de avaliações no total de cada Barbearia
const totalAvaliacoes = (barbeariaId) =>{
  const avaliacoesDaBarbearia = AllAvaliation.filter(avaliacao => avaliacao.barbearia_id === barbeariaId);
  return avaliacoesDaBarbearia.length;
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

      <div className="Outdoor">
        <div className="imgOutdoor">
            <img src={imgBarbearia } alt="foto-barbearia" id="imgBarbearia" />
        </div>
        <div className="BarbeariaInformation">
        <div className="imgBarbeariaProfile">
          <img src={barbeLogo} alt="foto-barbearia" id="barbeLogo" />
        </div>
            {barbearia.status === "Aberta" ? <p className="abertoBarbDetails">{barbearia.status}</p> : <p className="fechadoBarbDetails">{barbearia.status}</p>}
            <h3 id="BarbeariaName">{barbearia.name} • {calcularMediaAvaliacoes()} <i className="fa-solid fa-star"/> ({totalAvaliacoes(barbearia.id)})</h3>
            <span className="material-symbols-outlined location">location_on</span>
        </div>
        <p></p>
      </div>
      
      <hr />

      <div className="title__service">
        <p>Serviços</p>
      </div>
        <div className="Servicos">
          {servicos
            .filter(servico => servico.barbearia_id === barbearia.id)
            .map(servico => (
              <div key={servico.id} onClick={() => handleServiceChange(servico.id)} className={`servicoDiv ${selectedService === servico.id ? 'selected' : ''}`}>
                {servico.name}
              </div>
          ))}
        </div>

        <hr />

      <div className="tittle__Calendar">
        Escolha um dia de sua preferência
      </div>
      <div className="EscolhaDia">
        <Calendar id="Calendario"
          onChange={handleDateChange}
          value={selectedDate}
        />
      </div>

      <hr />
      <div className="tittle__Horarios">
        Horários Disponíveis
      </div>
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
              <li><button onClick={navigateBackToHome}><i className="fa-solid fa-house"></i></button></li>
              <li><button onClick={logoutClick}><i className="fa-solid fa-right-from-bracket"></i></button></li>
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
              <button id="SendAvaliation" onClick={enviarAvaliacao}>Enviar Avaliação</button>
            </div>

            <h2>Classificação e Avaliações</h2>
            <div className="classificacao">
              <h2>{calcularMediaAvaliacoes()}</h2>
              <p>({totalAvaliacoes(barbearia.id)})</p>
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