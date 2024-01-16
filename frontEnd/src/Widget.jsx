import { useEffect, useState } from "react";
import axios from "axios";


const Widget = () => {
  const [file, setfile] = useState();
  const [image, setImage] = useState([]);
  const [message, setMessage] = useState('');

  const handleFile = (e) => {
    setfile(e.target.files[0])
  }

  const handleUpload = () => {
    const userId = 2;
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
    const renamedFile = new File([file], `userId_${userId}.${fileExtension}`, { type: file.type });
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
      setImage(res.data.url);
    })
    .catch(err => console.log(err));
  }, [])

  return (
    <>
    <div className="container">
      <input type="file" onChange={handleFile}/>
      <button onClick={handleUpload}>upload</button>
    </div>
    <p>{message}</p>
    <img src={image} alt="" style={{width: '100px', height: '100px', objectFit: 'cover'}}/>
    </>
  );
};

export default Widget;