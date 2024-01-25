import { useEffect, useState } from "react";
import axios from "axios";
import './widget.css';


const Widget = () => {
  //Upload user image
  const [file, setfile] = useState();
  const [imageUser, setImageUser] = useState([]);
  const [message, setMessage] = useState('');

  //Upload Banner images
  const [bannerFiles, setBannerFiles] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerMessage, setBannerMessage] = useState('');

  //Upload user image
  const handleFile = (e) => {
    setfile(e.target.files[0])
  }

  const handleUpload = () => {
    const barbeariaId = 1;
    const allowedExtensions = ['jpg', 'jpeg', 'png'];

    const formdata = new FormData();

    // Obtém a extensão do arquivo original
    const fileExtension = file.name.split('.').pop();

    // Verifica se a extensão é permitida
    if (!allowedExtensions.includes(fileExtension)) {
    setMessage("Extensão de arquivo não permitida. Use 'jpg', 'jpeg' ou 'png'.");
    return;
  }

    // Obtém a data e hora atual
    const currentDateTime = new Date();

    // Formata a data e hora no formato desejado (por exemplo: YYYYMMDD_HHMMSS)
    const formattedDateTime = `${currentDateTime.getFullYear()}${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}${currentDateTime.getDate().toString().padStart(2, '0')}_${currentDateTime.getHours().toString().padStart(2, '0')}${currentDateTime.getMinutes().toString().padStart(2, '0')}${currentDateTime.getSeconds().toString().padStart(2, '0')}`;
  
    // Renomeia a imagem com o ID do usuário, número aleatório e a data/hora
    const renamedFile = new File([file], `userBarbeariaId_${barbeariaId}_${formattedDateTime}.${fileExtension}`, { type: file.type });
    formdata.append('image', renamedFile);

    axios.post('http://localhost:8000/upload', formdata)
    .then(res => {
      if(res.data.Status === "Success"){
        window.location.reload()
      }else{
        console.log('faled')
      }
    })
    .catch(err => console.log(err));
  }
  useEffect(() =>{
    axios.get('http://localhost:8000/imageUser')
    .then(res => {
      setImageUser(res.data.url);
    })
    .catch(err => console.log(err));
  }, [])

  //Upload banner images
  const handleBannerImages = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setBannerFiles(selectedFiles);
  }

  const handleBannerImagesUpload = () => {
    const barbeariaId = 1; // ou o ID do usuário correspondente
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const bannerFormData = new FormData();

    if (bannerFiles.length === 0) {
      setBannerMessage("Selecione pelo menos uma imagem.");
      return;
    }
    if(bannerFiles.length > 5){
      setBannerMessage("Selecione apenas 5 imagens");
      return;
    }

    // Itera sobre os arquivos selecionados
    for (let i = 0; i < bannerFiles.length; i++) {
      const file = bannerFiles[i];

      // Obtém a extensão do arquivo original
      const fileExtension = file.name.split('.').pop();

      // Verifica se a extensão é permitida
      if (!allowedExtensions.includes(fileExtension)) {
        setBannerMessage("Extensão de arquivo não permitida. Use 'jpg', 'jpeg' ou 'png'.");
        return;
      }

      // Renomeia a imagem com o ID do usuário mantendo a extensão original
      const renamedFile = new File([file], `barbeariaId_${barbeariaId}_banner_${i + 1}.${fileExtension}`, { type: file.type });

      // Adiciona o arquivo ao FormData
      bannerFormData.append(`images`, renamedFile);
    }

    axios.post('http://localhost:8000/upload-banners', bannerFormData)
      .then(res => {
        if (res.data.Status === "Success") {
          console.log('Banner Images Uploaded Successfully');
          window.location.reload();
        } else {
          console.log('Banner Images Upload Failed');
        }
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    axios.get('http://localhost:8000/api/banner-images')
      .then(result => {
        setBannerImages(result.data.urls);
      })
      .catch(error => console.log(error));
  }, [])
/*-------------------------------------------*/
const [mostrarSenha, setMostrarSenha] = useState(false);
const [passwordConfirm, setPasswordConfirm] = useState('');
const [newPassword, setNewPassword] = useState('');
const [messagePassword, setMessagePassword] = useState('');

const alternarSenha = () => {
  setMostrarSenha(!mostrarSenha);
};
const alterarSenha = () => {
  const barbeariaId = 1;
  axios.get('http://localhost:8000/api/update-password-barbearia', {
    params: {
      barbeariaId: barbeariaId,
      passwordConfirm: passwordConfirm,
      newPassword: newPassword
    }
  }).then(res => {
    if(res.data.Success === 'Success'){
      setMessagePassword("Senha Alterada com Sucesso!")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessagePassword('');
          window.location.reload();
        }, 3000);
    }
  }).catch(error => {
    setMessagePassword("Senha atual não confirmada!")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessagePassword('');
          //window.location.reload();
        }, 5000);
  });
};
/*-------------------------------------------*/
const [daysWeekSelected, setDaysWeekSelected] = useState([]);
const [QntDaysSelected, setQntDaysSelected] = useState([]);
const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const [mostrarDiasSemana, setMostrarDiasSemana] = useState(false);
const [messageAgenda, setMessageAgenda] = useState('');

  const alternarDiasTrabalho = () => {
    setMostrarDiasSemana(!mostrarDiasSemana);
  };
  const handleCheckboxChange = (dia) => {
    if (daysWeekSelected.includes(dia)) {
      // Se o dia já estiver selecionado, remova-o
      setDaysWeekSelected(daysWeekSelected.filter((selectedDia) => selectedDia !== dia));
    } else {
      // Se o dia não estiver selecionado, adicione-o
      setDaysWeekSelected([...daysWeekSelected, dia]);
    }
  };
  const Checkbox = ({ dia }) => {
    return (
      <>
        <input
          type="checkbox"
          id={dia}
          checked={daysWeekSelected.includes(dia)}
          onChange={() => handleCheckboxChange(dia)}
          className="days-switch" // Adicione a classe aqui
        />
        <label htmlFor={dia} className="switch">
          <span className="slider"></span>
        </label>
      </>
    );
  };
  const CheckboxQntDias = ({ value }) => {
    return (
      <>
        <input
          type="checkbox"
          id={value}
          checked={QntDaysSelected === value}
          onChange={() => {
            if (QntDaysSelected === value) {
              // Se a opção já estiver selecionada, desmarque-a
              setQntDaysSelected('');
            } else {
              // Caso contrário, selecione a opção
              setQntDaysSelected(value);
            }
          }}
          className="days-switch"
        />
        <label htmlFor={value} className="switch">
          <span className="slider"></span>
        </label>
      </>
    );
  };
  const updateAgenda = () =>{
    const barbeariaId = 1;
    
    axios.post(`http://localhost:8000/api/update-agenda/${barbeariaId}`, {daysWeek: daysWeekSelected, qntDays: QntDaysSelected})
    .then(res => {
      if(res.data.Success === 'Success'){
        setMessageAgenda("Agenda Atualizada com Sucesso!")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgenda('');
          window.location.reload();
        }, 3000);
      }
    }).catch(error => {
      setMessageAgenda("Não foi possível atualizar sua agenda.")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgenda('');
          window.location.reload();
        }, 3000);
      console.error('erro ao atualizar a agenda', error)
    })
  }
/*-------------------------------------------*/
  return (
    <>
      <div className="menu__main" onClick={alternarDiasTrabalho}>
        <span className="material-symbols-outlined icon_menu">calendar_clock</span>
          Definir Dias de Trabalho
        <span className={`material-symbols-outlined arrow`} id='arrow'>expand_more</span>
      </div>

      {mostrarDiasSemana && (
        <div className="divSelected">
          {messageAgenda === 'Agenda Atualizada com Sucesso!' ?
                <p className="mensagem-sucesso">{messageAgenda}</p>
                  :
                <p className="mensagem-erro">{messageAgenda}</p>
              }
        <p className='information__span'>Selecione os dias da semana em que deseja trabalhar:</p>
        {diasSemana.map((dia, index) => (
          <div className="container__checkBox" key={index}>
            <span>{dia}</span>
            <Checkbox dia={dia} />
          </div>
        ))}

        <p className='information__span'>Escolha a quantidade de dias a serem disponibilizados para agendamento:</p>
        <div className="container__checkBox">
          <span>Próximos 7 dias</span>
          <CheckboxQntDias value="7" />
        </div>
        <div className="container__checkBox">
          <span>Próximos 15 dias</span>
          <CheckboxQntDias value="15" />
        </div>
        <div className="container__checkBox">
          <span>Próximos 30 dias</span>
          <CheckboxQntDias value="30" />
        </div>
        <button className={`button__change ${QntDaysSelected.length > 0 && daysWeekSelected.length > 0 ? 'show' : ''}`} onClick={updateAgenda}>
          Alterar
        </button>

      </div>
      )}


      <div className="container">
        <input type="file" onChange={handleFile}/>
        <button onClick={handleUpload}>upload</button>
      </div>
      <p>{message}</p>
      <img src={imageUser} alt="" style={{width: '100px', height: '100px', objectFit: 'cover'}}/>

      <div className="container">
          <input type="file" onChange={handleBannerImages} multiple />
          <button onClick={handleBannerImagesUpload}>Upload Banners Images</button>
          <p>{bannerMessage}</p>
      </div>
      {bannerImages && (
        <div className="banner-images-container">
          {bannerImages.map((url, index) => (
            <img key={index} src={url} alt={`Banner ${index + 1}`} style={{width: '100px', height: '100px', objectFit: 'cover'}}/>
          ))}
        </div>
      )}

      <div className="menu__main" onClick={alternarSenha}>
          <span className="material-symbols-outlined icon_menu">password</span>
            Senha
            <span className={`material-symbols-outlined arrow ${mostrarSenha ? 'girar' : ''}`} id='arrow'>expand_more</span>
      </div>

      {mostrarSenha && (
            <div className="divSelected">
              <p className='information__span'>Alterar Senha</p>
              {messagePassword === 'Senha Alterada com Sucesso!' ?
                <p className="mensagem-sucesso">{messagePassword}</p>
                  :
                <p className="mensagem-erro">{messagePassword}</p>
              }

            <div className="inputBox">
              <p>{}</p>
              <input
                type="password"
                id="senha"
                name="senha"
                maxLength="10"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Limitar a 10 caracteres
                  const truncatedPasswordConfirm = inputValue.slice(0, 10);
                  setPasswordConfirm(truncatedPasswordConfirm);
                }}
                placeholder="Senha Atual"
                required
                />{' '} <span className="material-symbols-outlined icon_input">lock</span>
            </div>

            <div className="inputBox">
            <input
                type="password"
                id="NovaSenha"
                name="NovaSenha"
                maxlength="10"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Limitar a 8 caracteres
                  const truncatedValue = inputValue.slice(0, 8);
                  setNewPassword(truncatedValue);
                }}
                placeholder="Nova Senha"
                required
                />{' '} <span className="material-symbols-outlined icon_input">lock_reset</span>
            </div>

            <button className={`button__change ${newPassword ? 'show' : ''}`} onClick={alterarSenha}>
              Alterar
            </button>
         </div>
         
      )}

    </>
  );
};

export default Widget;