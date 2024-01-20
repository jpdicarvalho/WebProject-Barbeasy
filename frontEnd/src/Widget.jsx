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
        console.log('Succeded')
        window.location.reload();
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
  const [mostrarStatus, setMostrarStatus] = useState(false);
  const [status, setStatus] = useState();

  const alternarStatus = () => {
    setMostrarStatus(!mostrarStatus);
  };

  const statusUpdate = () => {
    // Aqui você pode fazer uma solicitação para o backend usando o axios
    axios.post('http://localhost:8000/api/status-update', { Status: status })
    .then(res => {
        if(res.data.Success === 'Success'){
          console.log('Status atualizado!');
        }
      })
      .catch(error => {
        // Lógica a ser executada em caso de erro na solicitação
        console.error('Erro ao atualizar o status:', error);
      });
  };
  useEffect(() => {
    axios.get('http://localhost:8000/api/status-barbearia')
      .then(res => {
        setStatus(res.data.StatusBarbearia)
      })
      .catch(error => console.log(error));
  }, [])

  return (
    <>
    <div className="menu__main" onClick={alternarStatus}>
            {status === 'Aberta' ?
            <span className="material-symbols-outlined icon_menu" style={{color: 'green'}}>radio_button_checked</span>
            :
            <span className="material-symbols-outlined icon_menu">radio_button_checked</span>
            }
            
              Status
            <span className={`material-symbols-outlined arrow ${mostrarStatus ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>
          

          {mostrarStatus && (
            <div className="divSelected">
              <div className="container__checkBox">
                <span>Aberta</span>
                <input
              type="checkbox"
              id='status'
              checked={status === 'Aberta'} // Marca o input se o status for 'Aberta'
              onChange={() => {
                const novoStatus = status === 'Aberta' ? 'Fechada' : 'Aberta'; // Inverte o estado atual
                setStatus(novoStatus); // Atualiza o estado 'status'
                statusUpdate(); // Chama a função para atualizar o status no backend
              }}
            />  

                <label htmlFor="status" className='switch'>
                  <span className='slider'></span>
                </label>
              </div>
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

    </>
  );
};

export default Widget;