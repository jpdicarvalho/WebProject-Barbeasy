import { useEffect, useState } from "react";
import './widget.css';


const Widget = () => {
  const barbeariaId = 1;

  const [mostrarServico, setMostrarServico] = useState(false);
  const [showAddServico, setShowAddServico] = useState(false);
  const [nomeServiço, setNomeServiço] = useState('');
  const [precoServiço, setPrecoServiço] = useState('');
  const [messageAddService, setMessageAddService] = useState('');


  const alternarServico = () => {
    setMostrarServico(!mostrarServico);
  };

  const alternarAddServico = () => {
    setShowAddServico(true);
  };

  const formatarPreco = (valor) => {
    const numero = valor.replace(/\D/g, ''); // Remove caracteres não numéricos
    const valorFormatado = (Number(numero) / 100).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return `R$ ${valorFormatado}`;
  };

  const handleChangePreco = (event) => {
    const valor = event.target.value;
    // Filtrar apenas os números
    const numero = valor.replace(/\D/g, '');
    setPrecoServiço(formatarPreco(numero));
  };

  const adicionarServico = () => {
    setMessageAddService("SERVICE ADD SUCCESSFULLY");
    setTimeout(() => {
      setMessageAddService(null);
      setShowAddServico(false);
    }, 3000);
    
    // // Fechar a div input_Container
  };

  console.log(nomeServiço)
  console.log(precoServiço)

  return (
    <>
      <div className="menu__main" onClick={alternarServico}>
        <span className="material-symbols-outlined icon_menu"/>
        Definir Serviços
        <span className={`material-symbols-outlined arrow ${mostrarServico ? 'girar' : ''}`} id='arrow'/>
      </div>

      {mostrarServico && (
        <div className="divSelected">

          <div className='container__servicos'>
            
          </div>

          <div className={`add_Service ${showAddServico ? 'expandir' : ''}`} onClick={alternarAddServico}>
            {showAddServico &&(
              <div className="input_Container">
                    <p className='information__span'>Qual o nome do serviço?</p>

                    <input
                    className="input_AddService"
                    type="text"
                    id="serviceName"
                    name="serviceName"
                    maxLength={30}
                    onChange={e => setNomeServiço(e.target.value)}
                    placeholder='Ex. Corte Social'
                    />

                    <p className='information__span'>Quanto vai custar?</p>
                    <input
                    className="input_AddService"
                    type="text"
                    id="precoServico"
                    name="precoServico"
                    value={precoServiço}
                    onChange={handleChangePreco}
                    maxLength={9}
                    placeholder="R$ 00,00"
                    required
                  />

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
                    {messageAddService}

                    <button className="add_Service" onClick={adicionarServico}>
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
