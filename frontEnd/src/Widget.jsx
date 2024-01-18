import { useEffect, useState } from "react";
import axios from "axios";


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

    // Renomeia a imagem com o ID do usuário mantendo a extensão original
    const renamedFile = new File([file], `userBarbeariaId_${barbeariaId}.${fileExtension}`, { type: file.type });
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

    </>
  );
};

export default Widget;