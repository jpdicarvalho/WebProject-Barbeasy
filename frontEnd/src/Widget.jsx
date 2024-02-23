import { useEffect, useState } from "react";
import axios from "axios";
import './widget.css';


const Widget = () => {
  const barbeariaId = 1;

  const [mostrarServico, setMostrarServico] = useState(false);
  const [showAddServico, setShowAddServico] = useState(false);

  const [nomeServiço, setNomeServiço] = useState('');
  const [precoServiço, setPrecoServiço] = useState('');
  const [tempoDuracao, setTempoDuracao] = useState([]);
  const [messageAddService, setMessageAddService] = useState('');

  //Função para mostar o menu Serviço
  const alternarServico = () => {
    setMostrarServico(!mostrarServico);
  };

  //Função para mostar o menu Adicionar Serviço
  const ShowAddService = () => {
    setShowAddServico(true);
  };
  const fecharExpandir = () => {
    setShowAddServico(false);
  };

  //Função para formartar o preço do serviço
  const formatarPreco = (valor) => {
    const numero = valor.replace(/\D/g, ''); // Remove caracteres não numéricos
    const valorFormatado = (Number(numero) / 100).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return `R$ ${valorFormatado}`;
  };

  //Função para adicionar o valor do serviço a variável definida
  const handleChangePreco = (event) => {
    const valor = event.target.value;
    // Filtrar apenas os números
    const numero = valor.replace(/\D/g, '');//Regex para aceitar apenas números no input
    setPrecoServiço(formatarPreco(numero));
  };

  // Função responsável por adicionar ou remover o tempo de duração selecionado
  const handleTempoDuracao = (tempo) => {
    // Verifica se já existem dois tempos selecionados e se o tempo clicado não está entre eles
    if (tempoDuracao.length === 1 && !tempoDuracao.includes(tempo)) {
        // Caso positivo, não faz nada e retorna
        return;
      }

        // Verifica se o tempo já está selecionado
      if (tempoDuracao.includes(tempo)) {
        // Se o tempo já estiver selecionado, remove-o da seleção
        setTempoDuracao(tempoDuracao.filter(item => item !== tempo));
      } else {
          // Se o tempo não estiver selecionado, adiciona-o à seleção
          setTempoDuracao([...tempoDuracao, tempo]);
      }
  }

  const adicionarServico = () => {
    if(nomeServiço && precoServiço && tempoDuracao[0]){
      axios.post(`http://localhost:8000/api/add-service/${barbeariaId}`, {nameService: nomeServiço, priceService: precoServiço, time: tempoDuracao[0]})
          .then(res => {
            if (res.data.Success === "Success") {
              setMessageAddService("Serviço adicionado com sucesso!");

              setTimeout(() => {
                setMessageAddService(null);
                window.location.reload()
              }, 2000);
              
            }
          })
          .catch(err => {
            setMessageAddService("Erro ao adicionar serviço!");

            setTimeout(() => {
              setMessageAddService(null);
              setShowAddServico(false);
              }, 3000);
            console.error(err);
          });
    }else{
      setMessageAddService("Preencha todos os campos!");
        setTimeout(() => {
          setMessageAddService(null);
        }, 3000);
    }
  };

  return (
    <>
    <div className={` ${showAddServico ? 'background-desfocado' : ''}`}></div>
      <div className="menu__main" onClick={alternarServico}>
        <span className="material-symbols-outlined icon_menu"/>
        Definir Serviços
        <span className={`material-symbols-outlined arrow ${mostrarServico ? 'girar' : ''}`} id='arrow'/>
      </div>

      {mostrarServico && (
        <div className="divSelected">

          <div className='container__servicos'>
            
          </div>

          <div className={`add_Service ${showAddServico ? 'expandir' : ''}`} onClick={ShowAddService}>
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
                      {['15min','30min','45min','60min','75min', '90min'].map((tempo, index) => (
                        <div
                          key={index}
                          className={`horario-item ${tempoDuracao.includes(tempo) ? 'Horario-selecionado' : ''}`}
                          onClick={() => handleTempoDuracao(tempo)}
                        >
                          <p>{tempo}</p>
                        </div>
                      ))}
                    </div>
                    {messageAddService === "Serviço adicionado com sucesso!" ? (
                        <p className="mensagem-sucesso">{messageAddService}</p>
                        ) : (
                        <p className="mensagem-erro">{messageAddService}</p>
                    )}
                     <button className="button__Salve__Service" onClick={adicionarServico}>
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
