import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import './home.css'

function Home() {


const navigate = useNavigate();

const [barbearias, setBarbearias] = useState([]);

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

    
    return (
        <div>
            <h1>Home Page</h1>
            {barbearias.map((barbearia) => (
            <div key={barbearia.id}>
                <button onClick={() => handleBarbeariaClick(barbearia)} style={{ backgroundColor: '#AE31FF', padding: 10, marginBottom: 8, borderRadius: 8}}>
                <h2>{barbearia.name}</h2>
                </button>
                <p>{barbearia.email}</p>
            </div>
            ))}
        </div>
    )
  }
  
  export default Home  