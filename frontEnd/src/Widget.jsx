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
/*--------------------------------------*/
const [mostrarNome, setMostrarNome] = useState(false);
const [novoUserName, setNovoUserName] = useState('');

const alternarNome = () => {
    setMostrarNome(!mostrarNome);
  };

const alterarUserName = () => {
    axios.post('http://localhost:8000/api/upload-user-name-barbearia', {newUserName: novoUserName})
    .then(res => {
        if(res.data.Success === 'Success'){
          console.log('foi')
          //window.location.reload()
        }
      })
      .catch(error => {
        // Lógica a ser executada em caso de erro na solicitação
        console.error('Erro ao atualizar o nome de usuário:', error);
      });
  };
/*-------------------------------------------*/

/*-------------------------------------------*/
  
/*-------------------------------------------*/
  return (
    <>

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

<div className="menu__main" onClick={alternarNome}>
          <span className="material-symbols-outlined icon_menu">person</span>
            Nome
            <span className={`material-symbols-outlined arrow ${mostrarNome ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>

          {mostrarNome && (
            <div className="divSelected">
              <p className='information__span'>Alterar Nome de usuário</p>

            <div className="inputBox">
            <input
                type="text"
                id="usuario"
                name="usuario"
                
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres não alfanuméricos
                  const filteredValue = inputValue.replace(/[^a-zA-Z0-9.\s]/g, '');
                  // Limitar a 30 caracteres
                  const userName = filteredValue.slice(0, 30);
                setNovoUserName({ userName });
                }}
                placeholder="Nome de Usuário"
                required
              />{' '}<span className="material-symbols-outlined icon_input">person_edit</span>
            </div>

            <button className={`button__change ${novoUserName ? 'show' : ''}`} onClick={alterarUserName}>
              Alterar
            </button>
         </div>
         
          )}

    </>
  );
};

export default Widget;