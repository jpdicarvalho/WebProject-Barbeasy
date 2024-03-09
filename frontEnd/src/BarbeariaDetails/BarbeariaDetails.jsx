import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion';

import { register } from 'swiper/element/bundle';
register();

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { EffectFade } from 'swiper/modules';


import { isToday, isYesterday, differenceInDays, differenceInMonths } from 'date-fns';
//import Calendar from 'react-calendar';
import logoMercadoPago from './logoMercadoPago.png'
import { Calendar } from '../Calendar/Calendar';
import './BarbeariaDetails.css'

import imgBarbearia from './img-barbearia.jpg'
//import barbeLogo from './barber-logo.png'
import logoBarbeariaTeste from './logo-barbearia-teste.png'

function BarbeariaDetails() {

const navigate = useNavigate();
const location = useLocation();

const { barbearia } = location.state;

//buscando informações do usuário logado
const userData = localStorage.getItem('userData');
//trasnformando os dados para JSON
const userInformation = JSON.parse(userData);
//Buscando os dados do usuário
//const userId = userInformation.user[0].id;
const userEmail = userInformation.user[0].email;
const userName = userInformation.user[0].name;

const [isMenuActive, setMenuActive] = useState(false);


//Ativação do menu principal
const handleMenuClick = () => {
      setMenuActive(!isMenuActive);
}

//função para navegarpara página home
const navigateToHome = () =>{
  navigate("/Home");
}
//Função LogOut
const logoutClick = () => {
  ['token', 'userData'].forEach(key => localStorage.removeItem(key));
  navigate("/SignIn");
};
/*=========== Buscandos os nomes dos banners da barbearia selecionada ===========*/
const[banners, setBanners] = useState([]);

useEffect(() =>{
  let namesBanners = barbearia.banner_images.split(',');
  setBanners(namesBanners)
}, []);




/*=========== Buscandos os serviço da Barbearia selecionada ===========*/
const [servicos, setServicos] = useState([]);

useEffect(() => {  
  const getServiceBarbearia = async () => {
          try {
            const response = await fetch('http://localhost:8000/listServico');
            const data = await response.json();
            setServicos(data);
          } catch (error) {
            console.error('Erro ao obter os registros:', error);
          }
  };
getServiceBarbearia();
}, []);

/*--------------------------------------------------------*/
const [selectedDate, setSelectedDate] = useState(null);
const [selectedTime, setSelectedTime] = useState("");
const [selectedService, setSelectedService] = useState("")
const [isAgendamentoConfirmed, setAgendamentoConfirmed] = useState(false);

//Função para selecionar a data escolhida pelo usuário
const handleDateChange = (date) => {
  //console.log('dia do agendamento', date);
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

//Requisição para realizar a gendamento
/*
const Agendar = async () => {
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
          barbeariaId: barbearia.id,
          userId
        }),
        
      });
      
      const data = await response.json();
      alert(data.message);
      //window.location.href = 'http://localhost:5173/Checkout';
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
  };*/

  const [url, setUrl] = useState(null);
//Mandan a requisição para a rota de Pagamento
const pagamento = async () => {
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
          nameServico: servicoSelecionado.name,
          userEmail
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
const urlMercadoPago = () => {
    window.open(url, 'modal');
};
//-------------------------------------------------------
const [avaliacao, setAvaliacao] = useState(0.5);
const [comentario, setComentario] = useState("");
const [AllAvaliation, setAllAvaliation] = useState([]);

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
          data_avaliacao: new Date(),
          userName
        }),
      });
      const data = await response.json();
      console.log(data)
      // Recarrega a página após a avaliação ser feita com sucesso
      window.location.reload();
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

//Reviews settings
const reviews = useRef();
const [width, setWidth] = useState(0);
const reviewsWidth = reviews.current?.scrollWidth - reviews.current?.offsetWidth;

useEffect(()=> {
  setWidth(reviewsWidth);
}, [reviewsWidth])

  return (
    <>
      <div className="Outdoor">
       
          <Swiper slidesPerView={1} effect={'fade'} modules={[EffectFade]} pagination={{clickable: true}} autoplay={{ delay: 3000 }}>
            {banners.map((item) =>
              <SwiperSlide key={item} className="Slide__Box">
                <img className='slider__image' src={`https://d15o6h0uxpz56g.cloudfront.net/${item}`} alt="Imagem da Barbearia" />
              </SwiperSlide>
            )} 
          </Swiper>
       
      <div className="BarbeariaInformation">
          {barbearia.status === "Aberta" ? <p className="abertoBarbDetails">{barbearia.status}</p> : <p className="fechadoBarbDetails">{barbearia.status}</p>}
          <h3 id="BarbeariaName">{barbearia.name} • {calcularMediaAvaliacoes()} <i className="fa-solid fa-star"/> ({totalAvaliacoes(barbearia.id)})</h3>
          <div className="location">
            <p className="material-symbols-outlined location">location_on </p>
            <p>{barbearia.endereco}</p>
          </div>
      </div>
      <p></p>
      </div>

    <div className="ContainerMain">
      <hr />

      <div className="tittle">
        <p>Serviços</p>
      </div>
        <div className="Servicos">
          {servicos
            .filter(servico => servico.barbearia_id === barbearia.id)
            .map(servico => (
              <div key={servico.id} onClick={() => handleServiceChange(servico.id)} className={`servicoDiv ${selectedService === servico.id ? 'selected' : ''}`}>
                <p>{servico.name} - R$ {servico.preco},00</p> 
              </div>
          ))}
        </div>

        <hr />

      <div className="tittle">
        Escolha um dia de sua preferência
      </div>
      <div className="EscolhaDia">
        <Calendar onDateChange={handleDateChange}/>
      </div>

      <hr />
      <div className="tittle">
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

        {selectedService && selectedDate && selectedTime && !isAgendamentoConfirmed && (
          <button
            id="AgendamentoButton"
            onClick={pagamento}
          >
            Continuar
          </button>
        )}
       
       {isAgendamentoConfirmed && (
        <button onClick={urlMercadoPago} className="mercadoPagoButton">
          <img src={logoMercadoPago} alt="logo Mercado Pago" className="mercadoPagoLogo" />
          Pagar com Mercado Pago
        </button>
      )}
        
        <ul className={`Navigation glassmorphism ${isMenuActive ? 'active' : ''}`}>
              <li><a href="#"><i className="fa-solid fa-user"></i></a></li>
              <li><button onClick={navigateToHome}><i className="fa-solid fa-house"></i></button></li>
              <li><button onClick={logoutClick}><i className="fa-solid fa-right-from-bracket"></i></button></li>
              <button onClick={handleMenuClick} className="toggleMenu glassmorphism"></button>
        </ul>

        <hr />
            <div className="AvaliacaoSection">
              <h4>Classificações e Avaliações</h4>
              <div className="Estrelas">
                <span id="span__star">Toque para Classificar:</span>
                {[1, 2, 3, 4, 5].map((estrela) => (
                  <span
                    key={estrela}
                    className={`fa fa-solid fa-star${avaliacao >= estrela ? ' selected' : ''}`}
                    onClick={() => setAvaliacao(estrela)}
                  ></span>
                ))}
              </div>
              <textarea
                placeholder="Deixe seu comentário aqui..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                required
              ></textarea>
              <button id="SendAvaliation" onClick={enviarAvaliacao}>Enviar Avaliação</button>
            </div>

    <hr />

      <div className="tittle">
      Avaliações
      </div>
      <motion.div
        ref={reviews}
        className="reviews"
        whileTap={{ cursor: "grabbing"}}>

      <motion.div
      className="reviews__container"
      drag="x"
      dragConstraints={{ left: -width, right: 0 }}
      >
          {AllAvaliation
            .filter(avaliacoes => avaliacoes.barbearia_id === barbearia.id)
            .sort((a, b) => b.id - a.id) // Ordenar pelo ID de forma decrescente
            .map(avaliacoes => {
              const isTodayReview = isToday(new Date(avaliacoes.data_avaliacao));
              const isYesterdayReview = isYesterday(new Date(avaliacoes.data_avaliacao));
              const differenceDays = differenceInDays(new Date(), new Date(avaliacoes.data_avaliacao));
              const differenceMonths = differenceInMonths(new Date(), new Date(avaliacoes.data_avaliacao));

              let formattedTime = '';

              if (isTodayReview) {
                formattedTime = 'hoje';
              } else if (isYesterdayReview) {
                formattedTime = 'ontem';
              } else if (differenceDays === 0) {
                formattedTime = 'hoje';
              } else if (differenceDays <= 30) {
                formattedTime = `há ${differenceDays} ${differenceDays === 1 ? 'dia' : 'dias'}`;
              } else {
                formattedTime = `há ${differenceMonths} ${differenceMonths === 1 ? 'mês' : 'meses'}`;
              }

              return (
                <motion.div key={avaliacoes.id} className="reviws__section">
                  <motion.div className="HeaderReview">
                    <motion.div className="img_User">
                      <img src={logoBarbeariaTeste} alt="" />
                    </motion.div>
                    <motion.div className="userName__Stars">
                      <p id="userName">{avaliacoes.user_name}</p>
                      <motion.div className="Estrelas">
                        <motion.div id="Star_Unlocked"></motion.div>
                        {[1, 2, 3, 4, 5].map((estrela) => (
                          <span
                            key={estrela}
                            className={`fa fa-solid fa-star${avaliacoes.estrelas >= estrela ? ' selected' : ''}`}
                          ></span>
                        ))}
                      </motion.div>
                    </motion.div>
                    <motion.div className="reviews__day">
                    <p>{formattedTime}</p>
                    </motion.div>
                  </motion.div>
                  {avaliacoes.comentarios}
                </motion.div>
            
              );
            })}
          </motion.div>
      </motion.div>
    </div>
    </>
  );
}

export default BarbeariaDetails