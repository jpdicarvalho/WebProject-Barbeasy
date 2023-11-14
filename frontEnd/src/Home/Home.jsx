//Libary necessárias
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
//Arq. de Estilização da página
import './home.css'
//imagens estáticas
import barberLogo from './barber-logo.png';
import imgUserDefault from './img-user-default.jpg'
import frenteBarbearia from './frente-barbearia.jpeg'

function Home() {

const navigate = useNavigate();

const [barbearias, setBarbearias] = useState([]);
const [distanciaParaBarbearias, setDistanciaParaBarbearias] = useState([]);
const [isMenuActive, setMenuActive] = useState(false);
const [saudacao, setSaudacao] = useState('');
const [AllAvaliation, setAllAvaliation] = useState([]);
const [search, setSearch] = useState('');


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
const barbeariaSearch = distanciaParaBarbearias.filter((barbearia) =>
  barbearia.name.toLowerCase().includes(searchLowerCase) ||
  barbearia.status.toLowerCase().includes(searchLowerCase)
);

//passando os dados da barbearia selecionada
const handleBarbeariaClick = (barbearia) => {
  navigate("/BarbeariaDetails", { state: barbearia });
};

//verificando se o menu está ativado
const handleMenuClick = () => {
        setMenuActive(!isMenuActive);
}

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

//pegando as cordenadas do usuário e calculando a distância entre ele e as barbearias cadastradas
useEffect(() => {
        const obterLocalizacao = () => {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const userLocation = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                };
                // Calcular a distância entre a localização do usuário e as coordenadas da barbearia
                const distanciaParaBarbearias = barbearias.map(barbearia => {
                  // Verificar se as coordenadas da barbearia são válidas
                  if (barbearia.latitude !== null && barbearia.longitude !== null) {
                    const distancia = calcularDistancia(
                      userLocation.latitude,
                      userLocation.longitude,
                      barbearia.latitude,
                      barbearia.longitude
                    );
                    // Adicionando a distância formatada ao objeto da barbearia
                    return { ...barbearia, distancia: formatarDistancia(distancia) };
                  } else {
                    // Se as coordenadas não estão presentes, definir "Distância não calculada"
                    return { ...barbearia, distancia: 'Distância não calculada' };
                  }
                });
      
                setDistanciaParaBarbearias(distanciaParaBarbearias);
              },
              (error) => {
                console.error('Erro ao obter a localização do usuário:', error);
              }
            );
          } else {
            console.error('Geolocalização não suportada pelo navegador.');
          }
        };
        obterLocalizacao();
}, [barbearias]);
// Função para calcular a distância usando a fórmula de Haversine
const calcularDistancia = (lat1, lon1, lat2, lon2) => {
        // Verificar se as coordenadas são válidas
        if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) {
          return null;
        }
      
        const R = 6371; // Raio médio da Terra em quilômetros
      
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
      
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
        const distancia = R * c;
        return distancia;
};

// Função para formatar a distância
const formatarDistancia = (distancia) => {
        if (distancia === 'null') {
          return 'Distância não calculada';
        }
        // Arredondar para uma casas decimais e adicionar a unidade de medida
        return `${distancia.toFixed(1)} km`;
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

            {barbeariaSearch.map((barbearia) => (
            <div key={barbearia.id} className="section">
              <div className="imgBoxSection">
                <img src={frenteBarbearia} alt="frente da barbearia" />
                </div>
                <div className="Barbearias">
                 <h2>{barbearia.name}</h2>
                </div>
                {barbearia.status === "Aberta" ? <p className="aberto">{barbearia.status}</p> : <p className="fechado">{barbearia.status}</p>}
                <div className="avaliation">
                <p>{calcularMediaAvaliacoesBarbearia(barbearia.id)}</p>
                  <i className="fa-solid fa-star"></i>
                <p>({totalAvaliacoes(barbearia.id)})</p>
                <p>{barbearia.distancia.length > 6 ? <p>Localização não info...</p>: <p>≅ {barbearia.distancia}</p>}</p>
                </div>
                <button className="agendar" onClick={() => handleBarbeariaClick(barbearia)}>Agendar</button>
                
            </div>
            
            ))}
            <ul className={`Navigation glassmorphism ${isMenuActive ? 'active' : ''}`}>
              <li><a href="#"><i className="fa-solid fa-user"></i></a></li>
              <li><a href="http://localhost:5173/"><i className="fa-solid fa-house"></i></a></li>
              <li><a href="http://localhost:5173/SignIn"><i className="fa-solid fa-right-from-bracket"></i></a></li>
              <button onClick={handleMenuClick} className="toggleMenu glassmorphism"></button>
            </ul>
            </div>
    )
}
export default Home  