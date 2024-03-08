import { useEffect, useState } from "react";
import {motion} from 'framer-motion';
import axios from "axios";

import { MdOutlineDone } from "react-icons/md";
import { VscError } from "react-icons/vsc";


import './widget.css';


const Widget = () => {
  const barbeariaId = 1;

  //Constantes de Upload de Imagens para o Banner
  const [bannerFiles, setBannerFiles] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerMessage, setBannerMessage] = useState(null);

  //Upload banner images
  const handleBannerImages = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setBannerFiles(selectedFiles);
  }

  //Preparando as imagens selecionadas para serem enviadas ao back-end
  const handleBannerImagesUpload = () => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'heif', 'HEIF'];

    const bannerFormData = new FormData();

    if (!bannerFiles) {
      console.error("No file selected."); // Caso nenhum arquivo seja selecionado
      return;
    }

    if(bannerFiles.length > 5){
      setBannerMessage("Selecione no máximo 5 imagens.");
      setTimeout(() => {
        setBannerMessage(null);
      }, 3000);
      return;
    }

    // Itera sobre os arquivos selecionados
    for (let i = 0; i < bannerFiles.length; i++) {
      const file = bannerFiles[i];

      // Obtém a extensão do arquivo original
      const fileExtension = file.name.split('.').pop();

      // Verifica se a extensão é permitida
      if (!allowedExtensions.includes(fileExtension)) {
        setBannerMessage("Extensão de arquivo não permitida. Use imagens 'jpg', 'jpeg' ou 'png'.");
        setTimeout(() => {
          setBannerMessage(null);
          
        }, 3000);
        return;
      }

      // Obtém a data e hora atual
      const currentDateTime = new Date();
      // Formata a data e hora no formato desejado (por exemplo: YYYYMMDD_HHMMSS)
      const formattedDateTime = `${currentDateTime.getFullYear()}${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}${currentDateTime.getDate().toString().padStart(2, '0')}_${currentDateTime.getHours().toString().padStart(2, '0')}${currentDateTime.getMinutes().toString().padStart(2, '0')}${currentDateTime.getSeconds().toString().padStart(2, '0')}`;
      // Renomeia a imagem com o ID do usuário mantendo a extensão original
      const renamedFile = new File([file], `barbeariaId_${barbeariaId}_banner_${i + 1}_${formattedDateTime}.${fileExtension}`, { type: file.type });

      // Adiciona o arquivo ao FormData
      bannerFormData.append(`images`, renamedFile);
      bannerFormData.append('barbeariaId', barbeariaId);
    }

    axios.post('http://localhost:8000/upload-banners', bannerFormData)
      .then(res => {
        if (res.data.Status === "Success") {
          setBannerMessage("Banner alterado com sucesso.");
          setTimeout(() => {
            setBannerMessage(null);
            window.location.reload()
          }, 2000);
        } else {
          setBannerMessage("Erro ao realizar alteração.");
          setTimeout(() => {
            setBannerMessage(null);
            window.location.reload()
          }, 3000);
        }
      })
      .catch(err => console.log(err));
  }

  

  //Função para obter as imagens cadastradas
  useEffect(() => {
    axios.get('http://localhost:8000/api/banner-images', {
      params: {
        barbeariaId: barbeariaId
      }
    })
    .then(result => {
      setBannerImages(result.data.urls);
    })
    .catch(error => console.log(error));
  }, [barbeariaId]);
  
/*=================================================*/

  return (
    <>

          

        <motion.div  className="banner">
          <motion.div
          className="container__banner"
          whileTap={{cursor:"grabbing"}}
          drag="x"
          dragConstraints={bannerImages.length === 5 ? { right: 0, left: -1600}:
                           bannerImages.length === 4 ? { right: 0, left: -1400}:
                           bannerImages.length === 3 ? { right: 0, left: -1000}:
                           bannerImages.length === 2 ? { right: 0, left: -600}:
                           bannerImages.length === 1 ? { right: 0, left: -200}:{ right: 0, left: 0}}

          >
          {bannerImages.map((image, index) => (
                  <motion.div key={index} className='container-img-upload' whileTap={{cursor:"grabbing"}} >
                    <img src={image} alt="" className='img-uploaded'  />
                  </motion.div>
                ))}
            <label htmlFor="input-file" id='drop-area'>
              <input
                type="file"
                accept="image/*"
                id='input-file'
                onChange={handleBannerImages}
                hidden
                multiple
              />
              <motion.div className="img-view" style={{ width: bannerImages.length > 0 ? '150px' : '380px' }}>
                
                <p>Incluir Imagem <br/>da Barbearia</p>
              </motion.div>
            </label>
          </motion.div>
        </motion.div>
        <button onClick={handleBannerImagesUpload}>upload</button>
    </>
  );
};

export default Widget;
