//Libary necessárias
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
//Arq. de Estilização da página
import './home.css'
//imagens estáticas
import barberLogo from './barber-logo.png';
import imgUserDefault from './img-user-default.jpg'
//import frenteBarbearia from './frente-barbearia.jpeg'
import InteriorBarbearia from './interior-barbearia.avif'
//import axios from "axios";

function Home() {

const navigate = useNavigate();

const [barbearias, setBarbearias] = useState([]);
const [isMenuActive, setMenuActive] = useState(false);
const [saudacao, setSaudacao] = useState('');
const [AllAvaliation, setAllAvaliation] = useState([]);
const [search, setSearch] = useState('');
//componente API GOOGLE
const [UserLocation, setUserLocation] = useState([]);
const [DistanciaBarbearias, setDistanciaBarbearias] = useState([]);

//listando as barbearias cadastradas
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/listBarbearia');
      const data = await response.json();
        setBarbearias(data);
    } catch (error) {
      console.error('Erro ao obter os registros:', error);
    }
  }
fetchData();
}, []);

//Convertendo o value do search para minusculo
const searchLowerCase = search.toLowerCase();

//Buscando Barbearia pelo input Search
const barbeariaSearch = barbearias.filter((barbearia) =>
  barbearia.name.toLowerCase().includes(searchLowerCase) ||
  barbearia.status.toLowerCase().includes(searchLowerCase)
);

const combinarDados = (barbearias, distanciaBarbearias) => {
  return barbearias.map((barbearia, index) => {
    const distanciaElements = distanciaBarbearias.rows?.[0]?.elements;

    if (distanciaElements) {
      const distanciaElement = distanciaElements[index];
      const distancia = distanciaElement ? distanciaElement.distance.text : 'Erro de conexão, atualize a página';
      const duracao = distanciaElement ? distanciaElement.duration.text : 'Erro de conexão, atualize a página';

      return {
        ...barbearia,
        distancia,
        duracao,
        // Adicione outras propriedades necessárias de barbeariaSearch
      };
    }

    // Se não houver elementos de distância, retorna um objeto com um aviso
    return {
      ...barbearia,
      distancia: 'Erro de conexão, atualize a página',
      duracao: 'Erro de conexão, atualize a página',
    };
  });
};
// Uso da função para obter o novo array combinado
const barbeariasCompletas = combinarDados(barbeariaSearch, DistanciaBarbearias);

//passando os dados da barbearia selecionada
const handleBarbeariaClick = (barbearia) => {
  navigate("/BarbeariaDetails", { state: barbearia });
};

//verificando se o menu está ativado
const handleMenuClick = () => {
  setMenuActive(!isMenuActive);
}
//Função Home Page
const homePageClick = () => {
  navigate("/");
}
//Função LogOut
const logoutClick = () => {
  localStorage.removeItem('token');
  navigate("/SignIn");
};
//pegando a hora para saudar o usuário
useEffect(() => {
  const obterSaudacao = () => {
  const horaAtual = new Date().getHours();
    if (horaAtual >= 5 && horaAtual < 12) {
        setSaudacao('Bom dia!');
    } else if (horaAtual >= 12 && horaAtual < 18) {
        setSaudacao('Boa tarde!');
    } else {
        setSaudacao('Boa noite!');
    }
  }
obterSaudacao();
}, []);

//pegando as cordenadas do usuário
useEffect(() => {
const obterLocalizacao = async () => {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    setUserLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  } catch (error) {
    console.error('Erro ao obter a localização do usuário:', error);
  }
};

  obterLocalizacao();
}, []);

// Modificando o trecho abaixo para incluir as latitudes e longitudes das barbearias na URL da API do Google
useEffect(() => {
  const sendUrlToServer = async () => {
    const coordenadasBarbearias = barbearias.map((barbearia) => ({
      latitude: barbearia.latitude,
      longitude: barbearia.longitude,
    }));
    //
    try {
      const response = await fetch('http://localhost:8000/reqApiGoogle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latUser: UserLocation.latitude,
          lonUser: UserLocation.longitude,
          coordenadasBarbearias
        }),
        
      });
      
      const data = await response.json();
      //console.log(data)
      setDistanciaBarbearias(data);
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
}
sendUrlToServer();
}, [barbearias, UserLocation]);

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

// Calcula a média das avaliações para uma barbearia específica
const calcularMediaAvaliacoesBarbearia = (barbeariaId) => {
// Filtra as avaliações pelo ID das barbearias
const avaliacoesDaBarbearia = AllAvaliation.filter(avaliacao => avaliacao.barbearia_id === barbeariaId);
  if (avaliacoesDaBarbearia.length === 0) {
    return "0,0"; // Retorna "0,0" se não houver avaliações
  }
  const somaNotas = avaliacoesDaBarbearia.reduce((soma, avaliacao) => soma + avaliacao.estrelas, 0);
  const media = somaNotas / avaliacoesDaBarbearia.length;
  return media.toFixed(1).replace('.', ',');
};

    return (
          <div className="containerHome">
            <div className="header">
                <div className="imgBoxSectionUser">
                  <img src={imgUserDefault} alt="foto de perfil do usuário" />
                  <div className="spanUser">
                    <span>Olá, João Pedro! </span>
                    <p>{saudacao}</p>
                  </div>
                  
                </div>
                <div className="Barbeasy">
                  <img id="logoBarbeasy" src={barberLogo} alt="lodo-Barbeasy"/>
                  <h1>Barbeasy</h1>
                </div>
                <div className="containerSearch">
                  <div className="inputBoxSearch">
                    <i className="fa-solid fa-magnifying-glass lupa"></i>
                    <input type="search" id="inputSearch" name="name" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Encontrar Barbearia'/>
                    <div className="location">
                      <i className="fa-solid fa-location-crosshairs fa-xl location"></i>
                    </div>
                  </div>
                </div> 
              </div>

              {barbeariasCompletas.map((barbearia) => (
                <div key={barbearia.id} className="containerBarbearia">
                      <div className="imgBoxSection">
                        <img src={InteriorBarbearia} alt="frente da barbearia" />
                      </div>
                  <div className="section">
                  {barbearia.status === "Aberta" ? (
                        <p className="aberto">{barbearia.status}</p>
                      ) : (
                        <p className="fechado">{barbearia.status}</p>
                      )}
                      
                      <div className="Barbearias">
                        <h2>{barbearia.name} • {calcularMediaAvaliacoesBarbearia(barbearia.id)}
                        <i className="fa-solid fa-star"></i>
                        ({totalAvaliacoes(barbearia.id)})
                        </h2>
                      </div>
                      
                      <div className="distancia-duracao">
                        <p>{barbearia.distancia} • {barbearia.duracao}</p>
                        <i className="fa-solid fa-person"></i>
                      </div>
                      <button className="agendar"
                        onClick={() => handleBarbeariaClick(barbearia)}>
                        Agendar
                      </button>
                  </div>
                  
                </div>
              ))}
            <ul className={`Navigation glassmorphism ${isMenuActive ? 'active' : ''}`}>
              <li><a href="#"><i className="fa-solid fa-user"></i></a></li>
              <li><button onClick={homePageClick}><i className="fa-solid fa-house"></i></button></li>
              <li><button onClick={logoutClick}><i className="fa-solid fa-right-from-bracket"></i></button></li>
              <button onClick={handleMenuClick} className="toggleMenu glassmorphism"></button>
            </ul>
            </div>
    )
}
export default Home  