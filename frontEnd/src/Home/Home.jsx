import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import './home.css'
import barberLogo from './barber-logo.png';

function Home() {


const navigate = useNavigate();

const [barbearias, setBarbearias] = useState([]);
const [isMenuActive, setMenuActive] = useState(false);


useEffect(() => {
    fetchData();
  }, []);

      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:8000/listBarbearia');
          const data = await response.json();
          setBarbearias(data);
          
        } catch (error) {
          console.error('Erro ao obter os registros:', error);
        }
      };

      const handleBarbeariaClick = (barbearia) => {
        navigate("/BarbeariaDetails", { state: barbearia });
      };
      const handleMenuClick = () => {
        setMenuActive(!isMenuActive);
      }
    
    return (
          <div className="containerHome">
            <div className="header glassmorphism">
                <div className="imgBoxSectionUser">
                  <i className="fa-solid fa-user"></i>
                </div>

                <span>Olá User!</span>

                <div className="inputBoxSearch">
                  <div id="lupa"><i className="fa-solid fa-magnifying-glass"></i></div>
                    <form >
                      <input type="text" id="inputSearch" name="name" placeholder='Encontrar Barbearia'/>
                      <input type="submit" id="Search" value="Pesquisar"/>
                    </form>
                  <div id="filtro" ><i className="fa-solid fa-filter fa-xl"></i></div>
                  <div id="h3"><h3 >Barbearias Encontradas: 15</h3></div>
                </div> 
              </div>

            {barbearias.map((barbearia) => (
            <div key={barbearia.id} className="section">
              <div className="imgBoxSection">
                <img src={barberLogo} alt="" />
              </div>
                <div className="Barbearias">
                <h2>{barbearia.name}</h2>
                {barbearia.status === "Aberto" ? <p className="aberto">{barbearia.status}</p> : <p className="fechado">{barbearia.status}</p>}
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