import { useEffect, useState } from "react";
import axios from "axios";
import './widget.css';


const Widget = () => {
  const barbeariaId = 1;

  const [mostrarServico, setMostrarServico] = useState(false);
  const [showAddServico, setShowAddServico] = useState(false);

  const alternarServico = () => {
    setMostrarServico(!mostrarServico);
  };

  const alternarAddServico = () => {
    setShowAddServico(true);
  };

  return (
    <>
      <div className="menu__main" onClick={alternarServico}>
        <span className="material-symbols-outlined icon_menu">cut</span>
        Definir Serviços
        <span className={`material-symbols-outlined arrow ${mostrarServico ? 'girar' : ''}`} id='arrow'>expand_more</span>
      </div>

      {mostrarServico && (
        <div className="divSelected">

          <div className='container__servicos'>
            
          </div>

          <div className={`add_Service ${showAddServico ? 'expandir' : ''}`} onClick={alternarAddServico}>
            {showAddServico &&(
              <div className="input_Container">
                    <p className='information__span'>Qual o nome do serviço?</p>
                    <input className="input_AddService" type="text" id="serviceName" name="serviceName" placeholder='Ex. Corte Social'/>
                    <p className='information__span'>Quanto vai custar?</p>
                    <input className="input_AddService" type="text" id="serviceName" name="serviceName" placeholder='R$ 00,00'/>
                    <p className='information__span'>Qual o tempo de duração?</p>
                    <div className="inputs-horarios">
                      {['15min','30min','45min','60min','75min', '90min'].map((atendimento, index) => (
                        <div
                          key={index}
                          className={`horario-item ${showAddServico ? 'Horario-selecionado' : ''}`}
                        >
                          <p>{atendimento}</p>
                        </div>
                      ))}
                    </div>

                    <button className="add_Service" onChange={() => setShowAddServico(!showAddServico)}>
                      Adicionar Serviço
                    </button>

                
                
              </div>
            )}
           
              <span className="material-symbols-outlined">add</span>
              Adicionar Serviço
              
          </div>
        </div>
      )}
    </>
  );
};

export default Widget;
