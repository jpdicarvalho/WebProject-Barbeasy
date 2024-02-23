import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql";
import jwt  from 'jsonwebtoken';
import MercadoPago from "mercadopago";

import multer from "multer";

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { serveSwaggerUI, setupSwaggerUI } from './swaggerConfig.js';

import 'dotenv/config'

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Inicialize o Swagger
app.use('/api-docs', serveSwaggerUI, setupSwaggerUI);

//Create conection with BD MySQL
const db = mysql.createConnection({
  host: process.env.database_Host,
  user: process.env.database_User,
  password: process.env.database_Password,
  database: process.env.database_Name
});

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const awsBucketName = process.env.AWS_S3_BUCKET_NAME
const awsRegion = process.env.AWS_REGION
const awsAccessKey = process.env.AWS_ACCESS_KEY_ID
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3Client({
  credentials:{
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretAccessKey,
  },
  region: awsRegion
});

app.post('/upload', upload.single('image'), (req, res) => {
  const barbeariaId = 1;
  const newImageUser = req.file.originalname;

  //Buscando imagem atual salva no BD MySQL
  const currentImg = "SELECT user_image FROM barbearia WHERE id = ?";
  db.query(currentImg, [barbeariaId], (err, result) => {
    if(err){
      console.error('Error on Update Image:', err);
      return res.status(500).json({ error: 'Current Image - Internal Server Error' });
    }
    //Verificando se há imagem salva
    if(result.length > 0){
      const currentImageName = result[0].user_image; //Nome da imagem salva no BD MySQL

      //Configurando os parâmetros para apagar a imagem salva no bucket da AWS S3
      const params = {
        Bucket: awsBucketName,
        Key: currentImageName
      }
      const command = new DeleteObjectCommand(params)//Instânciando o comando que irá apagar a imagem

      //Enviando o comando para apagar a imagem
      s3.send(command, (sendErr, sendResult) =>{
        if(sendErr){
          console.error('Send Error:', sendErr);
        }else{
          //Atualizando a coluna 'user_image' com a nova imagem do usuário
          const sql = "UPDATE barbearia SET user_image=? WHERE id=?";
          db.query(sql, [newImageUser, barbeariaId], (updateErr, updateResult) => {
            if (updateErr) {
              //Mensagem de erro caso não seja possuível realizar a atualização da imagem no Banco de Dados
              console.error('Error on Update Image:', updateErr);
              return res.status(500).json({ error: 'Update Image - Internal Server Error' });
            }else{
                // Cria os parâmetros para enviar a imagem para o bucket da AWS S3
                const updateParams = {
                Bucket: awsBucketName,
                Key: newImageUser,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
              }
              const updateCommand = new PutObjectCommand(updateParams)// Instânciando o comando que irá salvar a imagem
              s3.send(updateCommand)// Envia o comando para o Amazon S3 usando a instância do serviço S3
              return res.status(200).json({ Status: "Success" });
            }
          });
        }
      })
    }
  });
});
app.get('/imageUser', (req, res) =>{
  const barbeariaId = 1; 

  const sql = "SELECT user_image FROM barbearia WHERE id = ?";
  db.query(sql, [barbeariaId], async (err, result) => {
    if(err){
      console.error('Erro ao buscar imagem no banco de dados:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }else{
      if(result.length > 0){
        const url = "https://d15o6h0uxpz56g.cloudfront.net/" + result[0].user_image;
  
        return res.json({url});
      }
    }
  })
})

// Rota POST '/upload-banners' para lidar com o upload de imagens de banners
app.post('/upload-banners', upload.array('images'), (req, res) => {

    const barbeariaId = 1;

    const currentBannerImg = "SELECT banner_images FROM barbearia WHERE id = ?";
    db.query(currentBannerImg, [barbeariaId], (currentErr, currentResult) =>{
      if(currentErr){
        console.error('Erro ao buscar o nome das imagens banners no banco de dados:', currentErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if(currentResult.length > 0) {
        const bannerImagesName = currentResult[0].banner_images;
        const bannerImagesArray = bannerImagesName.split(',');

        for(let i = 0; i < bannerImagesArray.length; i++){
          //Configurando os parâmetros para apagar a imagem salva no bucket da AWS S3
          const deleteParams = {
            Bucket: awsBucketName,
            Key: bannerImagesArray[i]
          }
          const deleteCommand = new DeleteObjectCommand(deleteParams)//Instânciando o comando que irá apagar a imagem
          //Enviando o comando para apagar a imagem
          s3.send(deleteCommand, (uploadBannerErr, uploadBannerResult) => {
            if(uploadBannerErr){
              console.error('Erro ao apagar as imagens banners no bucket aws-s3:', uploadBannerErr);
              return res.status(500).json({ error: 'Internal Server Error' });
            }else{
              //obtendo o nome e o buffer para salvar no BD e na AWS-S3, respectivamente, das imagens enviadas
              const bannerImages = req.files.map((file) => {
                return {
                  originalname: file.originalname,
                  buffer: file.buffer,
                };
              });
              //Enviando imagem por imagem para o bucket aws-s3
              for (let i = 0; i < bannerImages.length; i++) {
                const params = {
                  Bucket: awsBucketName,
                  Key: bannerImages[i].originalname,
                  Body: bannerImages[i].buffer,
                  ContentType: bannerImages[i].mimetype,
                }
                // Cria um comando PutObject para enviar o arquivo para o AWS S3
                const command = new PutObjectCommand(params)
                // Envia o comando para o Amazon S3 usando a instância do serviço S3
                s3.send(command)
              }
              //Array com os nomes das imagens enviadas
              const bannerImagesName = [];
              //Salvando os nomes das imagens no array acima
              for (let i = 0; i < bannerImages.length; i++) {
                bannerImagesName.push(bannerImages[i].originalname);
              }
              // Converte o array de nomes em uma string separada por vírgulas
              const bannerImagesNameString = bannerImagesName.join(','); 
              //Atualizando o nome das imagens banner no BD MySQL
              const sql = "UPDATE barbearia SET banner_images = ? WHERE id = ?";
              db.query(sql, [bannerImagesNameString, barbeariaId], (err, result) => {
                if (err) {
                  console.error('Erro ao atualizar o nome das imagens no banco de dados:', err);
                  return res.status(500).json({ error: 'Internal Server Error' });
                }
              });
            }
            // Retorna um JSON indicando sucesso após a atualização do banco de dados
            res.status(200).json({ Status: 'Success' });
          })
        }
      }
    })
});
app.get('/api/banner-images', (req, res) => {
  const barbeariaId = 1;

  const sql = "SELECT banner_images FROM barbearia WHERE id = ?";
  db.query(sql, [barbeariaId], async (err, result) => {
    if (err) {
      console.error('Erro ao buscar imagens banner no banco de dados:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (result.length > 0) {
      const bannerImagesName = result[0].banner_images;//Obtendo String com os nomes das imagens salvas
      const bannerImagesArray = bannerImagesName.split(',');//Separando os nomes das imagens e salvando em um array
      const urls = [];//Array para armazenar as urls das imagens salvas no bucket AWS-S3

      for (let i = 0; i < bannerImagesArray.length; i++) {
        const imageName = bannerImagesArray[i];//Pegando o nome de cada imagem salva no array anterior
        const url = "https://d15o6h0uxpz56g.cloudfront.net/" + imageName;// Salvando a URL da imagem obtida pelo Cloud Front AWS-S3
        urls.push(url);//Adicionando a nova imagem no Array de URLs
      }
      return res.json({ urls });
    }
  });
});

//Rota para atualizar o status da barbearia 'Aberta' ou 'Fechada'
app.post('/api/status-update', (req, res) =>{
  const barbeariaId = 1;
  const status = req.body.Status === 'Aberta' ? 'Fechada': 'Aberta';
  const sql = "UPDATE barbearia SET status = ? WHERE id = ?";
  db.query(sql, [status, barbeariaId], (err, result) =>{
    if(err){
      console.error("Erro ao atualizar o status da barbearia", err);
      return res.status(500).json({Error: "Internal Server Error"});
    }else{
      if(result){
        return res.status(200).json({Success: "Success"});
      }
    }
  })
});
//Rota para obter o status da barbearia
app.get('/api/status-barbearia', (req, res) =>{
  const barbeariaId = 1;
  const sql = "SELECT status FROM barbearia WHERE id = ?";
  db.query(sql, [barbeariaId], (err, result) => {
    if(err) {
      console.error("Erro ao buscar o status da barbearia", err);
      return res.status(500).json({Error: "Internal Server Error"});
    }else{
      if(result.length > 0){
        const statusBarbearia = result[0].status;
        return res.status(200).json({ StatusBarbearia: statusBarbearia});
      }
    }
  })
});

//Rota para atualizar o nome da barbearia
app.post('/api/update-barbearia-name', (req, res) => {
  const barbeariaId = 1;
  const novoNomeBarbearia = req.body.novoNome;
  const sql = "UPDATE barbearia SET name = ? WHERE id = ?";
  db.query(sql, [novoNomeBarbearia, barbeariaId], (err, result) =>{
    if(err){
      console.error("Erro ao atualizar o nome da barbearia", err);
      return res.status(500).json({Error: "Internal Server Error"});
    }else{
      if(result) {
        return res.status(200).json({Success: "Success"});
      }
    }
  })
});
//Rota para obter o nome da barbearia
app.get('/api/nome-barbearia', (req, res) => {
  const barbeariaId = 1;
  const sql = "SELECT name FROM barbearia WHERE id = ?";
  db.query(sql, [barbeariaId], (err, result) => {
    if(err) {
      console.error("Erro ao buscar o nome da barbearia", err);
      return res.status(500).json({Error: "Internal Server Error"});
    }else{
      if(result.length > 0) {
        const nomeBarbearia = result[0].name;
        return res.status(200).json({ NomeBarbearia: nomeBarbearia});
      }
    }
  })
});
//Rota para atualizar o endereço da barbearia
app.post('/api/update-endereco', (req, res) => {
  const barbeariaId = 1;
  const values = req.body.Values;//Obtendo os valores informados pelo usuário

  const enderocoArray = [];//Array para armazenar os valores separadamente

  //Adicionando os valores no array anterior
  enderocoArray.push(values.street);
  enderocoArray.push(values.number);
  enderocoArray.push(values.neighborhood);
  enderocoArray.push(values.city);

  // Usando o método join para criar uma string com vírgula e espaço como separadores
  const newEndereco = enderocoArray.join(', ');

  const sql = "UPDATE barbearia SET endereco = ? WHERE id = ?";
  db.query(sql, [newEndereco, barbeariaId], (err, result) =>{
    if(err){
      console.error("Erro ao atualizar o endereço da barbearia", err);
      return res.status(500).json({Error: "Internal Server Error"});
    }else{
      if(result){
        return res.status(200).json({Success: "Success"});
      }
    }
  })
});
//Rota para atualizar o nome de usuário da barbearia
app.post('/api/upload-user-name-barbearia', (req, res) => {
  const barbeariaId = 1;
  const newUserName = req.body.newUserName.userName;

  const sql = "UPDATE barbearia SET usuario = ? WHERE id = ?";
  db.query(sql, [newUserName, barbeariaId], (err, result) =>{
    if(err){
      console.error("Erro ao atualizar o nome de usuário da barbearia", err);
      return res.status(500).json({Error: "Internal Server Error"});
    }else{
      if(result){
        return res.status(200).json({Success: "Success"});
      }
    }
  })
});
//Rota para obter o nome de usuário da barbearia
app.get('/api/user-name-barbearia', (req, res) => {
  const barbeariaId = 1;
  const sql = "SELECT usuario FROM barbearia WHERE id = ?";
  db.query(sql, [barbeariaId], (err, result) => {
    if(err) {
      console.error("Erro ao buscar o nome da barbearia", err);
      return res.status(500).json({Error: "Internal Server Error"});
    }else{
      if(result.length > 0) {
        const userNameBarbearia = result[0].usuario;
        return res.status(200).json({ UserNameBarbearia: userNameBarbearia});
      }
    }
  })
});
//Rota para atualizar o email de usuário da barbearia
app.post('/api/upload-email-barbearia', (req, res) => {
  const barbeariaId = 1;
  const newEmail = req.body.NewEmail;

  const sql = "UPDATE barbearia SET email = ? WHERE id = ?";
  db.query(sql, [newEmail, barbeariaId], (err, result) =>{
    if(err){
      console.error("Erro ao atualizar o email de usuário barbearia", err);
      return res.status(500).json({Error: "Internal Server Error"});
    }else{
      if(result){
        return res.status(200).json({Success: "Success"});
      }
    }
  })
});
//Rota para obter o email de usuário da barbearia
app.get('/api/email-barbearia', (req, res) => {
  const barbeariaId = 1;
  const sql = "SELECT email FROM barbearia WHERE id = ?";
  db.query(sql, [barbeariaId], (err, result) => {
    if(err) {
      console.error("Erro ao buscar o email de usuário da barbearia", err);
      return res.status(500).json({Error: "Internal Server Error"});
    }else{
      if(result.length > 0) {
        const emailBarbearia = result[0].email;
        return res.status(200).json({ EmailBarbearia: emailBarbearia});
      }
    }
  })
});
//Rota para comparar a senha de usuário da barbearia
app.get('/api/update-password-barbearia', (req, res) => {
  const barbeariaId = req.query.barbeariaId;
  const passwordConfirm = req.query.passwordConfirm;
  const newPassword = req.query.newPassword;
  
  const sql = "SELECT senha FROM barbearia WHERE id = ? AND senha = ?";
  db.query(sql, [barbeariaId, passwordConfirm], (err, result) => {
    if(err) {
      console.error("Erro ao comparar senha de usuário da barbearia", err);
      return res.status(500).json({Error: "Internal Server Error"});
    }
    if(result.length > 0) {
      const sql = "UPDATE barbearia SET senha = ? WHERE id = ?";
      db.query(sql, [newPassword, barbeariaId], (err, result) =>{
        if(err){
          console.error("Erro ao atualizar a senha de usuário barbearia", err);
          return res.status(500).json({Error: "Internal Server Error"});
        }
      })
      return res.status(200).json({ Success: "Success"});
    }else{
      return res.status(404).json({ Success: "Falied"});
    }
  })
});
//Rota para atualizar a agenda da barbearia
app.post('/api/update-agenda/:barbeariaId', (req, res) => {
  //Obtendo as variáveis enviadas
  const barbeariaId = req.params.barbeariaId;
  const daysWeekSelected = req.body.daysWeek;
  const QntDaysSelected = req.body.qntDays;

  //Concatenando os nomes dos dias da semana selecionado
  const daysWeekName = daysWeekSelected.join(',');

  //Verificando se há registro na agenda referente a barbearia informada
  const sql = "SELECT * FROM agenda WHERE barbearia_id = ?";
  db.query(sql, [barbeariaId], (err, result) => {
    if(err){
      console.error("Erro ao encontrar registro na agenda", err);
      return res.status(500).json({Error: "Internal Server Error"});
    }else{
      if(result.length > 0){
        const sqlUpdate = "UPDATE agenda SET dias = ?, qnt_dias = ? WHERE barbearia_id = ?";
        db.query(sqlUpdate, [daysWeekName, QntDaysSelected, barbeariaId], (err, result) =>{
          if(err){
            console.error("Erro ao cadastrar agenda da barbearia", err);
            return res.status(500).json({Error: "Internal Server Error"});
          }else{
            if(result){
              return res.status(200).json({Success: "Success"});
            }
          }
        })
      }else{
        const HP = 'horarioPadronizado';
        const sqlInsert = "INSERT INTO agenda (barbearia_id, dias, qnt_dias, horariosTdias, dom, seg, ter, qua, qui, sex, sab) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sqlInsert, [barbeariaId, daysWeekName, QntDaysSelected, HP, HP, HP, HP, HP, HP, HP, HP], (err, result) =>{
          if(err){
            console.error("Erro ao cadastrar agenda da barbearia", err);
            return res.status(500).json({Error: "Internal Server Error"});
          }else{
            if(result){
              return res.status(200).json({Success: "Success"});
            }
          }
        })
      }
    }
  })
});
//Rota para obter informações da agenda da barbearia
app.get('/api/agenda/:barbeariaId', (req, res) => {
  const barbeariaId = req.params.barbeariaId;
  
  const sql = "SELECT dias, qnt_dias FROM agenda WHERE barbearia_id = ?";
  db.query(sql, [barbeariaId], (err, result) => {
    if(err) {
      console.error("Erro ao buscar as informações da agenda da barbearia", err);
      return res.status(500).json({Error: "Internal Server Error"});
    }else{
      if(result.length > 0) {
        const agenda = [];

        agenda.push(result[0].dias);
        agenda.push(result[0].qnt_dias);

        return res.status(200).json({ Agenda: agenda});
      }
    }
  })
});

// Rota para salvar a agenda de horários do dia selecionado
app.post('/api/update-agendaDiaSelecionado/:barbeariaId', (req, res) => {
  const barbeariaId = req.params.barbeariaId;
  const agendaDiaSelecionado = req.body.StrAgenda;

  // Objeto para mapear os dias da semana para abreviações
  const diasDaSemana = {
      'm': 'dom',
      'g': 'seg',
      'r': 'ter',
      'a': 'qua',
      'i': 'qui',
      'x': 'sex',
      'b': 'sab'
  };

  // Verifica se a entrada é válida
  if (typeof agendaDiaSelecionado !== 'string' || agendaDiaSelecionado.length < 3) {
      return res.status(400).json({ error: 'Entrada inválida' });
  }

  const diaAbreviado = diasDaSemana[agendaDiaSelecionado[2]];

  if (diaAbreviado) {
    // Construir a consulta SQL dinamicamente
    const sql = `UPDATE agenda SET ${diaAbreviado} = ? WHERE barbearia_id = ?`;
    db.query(sql, [agendaDiaSelecionado, barbeariaId], (err, result) => {
        if (err) {
            console.error("Erro ao cadastrar agenda do dia selecionado da barbearia", err);
            return res.status(500).json({ Error: "Internal Server Error" });
        } else {
            if (result) {
                return res.status(200).json({ Success: "Success" });
            }
        }
    });
} else {
    return res.status(404).json({ Error: "Dia da semana desconhecido" });
}
});
//Rota para obter os horarios definidos para cada dia em específico
app.get('/api/agendaDiaSelecionado/:barbeariaId', (req, res) =>{
  const barbeariaId = req.params.barbeariaId;

  //Consultando as colunas que possuem os horários de trabalho da barbearia
  const sql = "SELECT horariosTdias, dom, seg, ter, qua, qui, sex, sab FROM agenda WHERE barbearia_id = ?";
  db.query(sql, [barbeariaId], (err, result) => {
    //Verifição de erro na consulta
    if(err){
      console.error("Erro ao buscar os horários da agenda da barbearia", err);
      return res.status(500).json({Error: "Internal Server Error"});
    }
    //Verificação de Sucesso na consulta
    if(result.length > 0){
      let arrayResult = [];//Array para armazenar os dados resultantes

      //Adicionando os dados obtidos no Array declado acima
      arrayResult.push(result[0].horariosTdias);
      arrayResult.push(result[0].dom);
      arrayResult.push(result[0].seg);
      arrayResult.push(result[0].ter);
      arrayResult.push(result[0].qua);
      arrayResult.push(result[0].qui);
      arrayResult.push(result[0].sex);
      arrayResult.push(result[0].sab);

      //Lógica para remover os valores sem horários
      for(let i=0; i < arrayResult.length; i++){
        //Verificação de valor sem horário
        if(arrayResult[i] === 'horarioPadronizado'){
          arrayResult = arrayResult.filter(item => item !== 'horarioPadronizado');//Adicionando os horários encontrados
          return res.status(200).json({ Success: "Success", horariosDiaEspecifico: arrayResult});//Enviando o array com os horários
        }else{
          return res.status(200).json({ Success: "Success", horariosDiaEspecifico: arrayResult});//Enviando o array com os horários
        }
      }
    }
  })
});
//Rota para salvar a genda de horários para todos os dias definidos
app.post('/api/update-horariosTodosOsDias/:barbeariaId', (req, res) => {
  const barbeariaId = req.params.barbeariaId;
  const strHorariosTodosOsDias = req.body.StrAgenda;
  const value = 'horarioPadronizado';

  const sql = "UPDATE agenda SET horariosTdias = ? WHERE barbearia_id = ?";
  db.query(sql, [strHorariosTodosOsDias, barbeariaId], (err, result) =>{
    if(err){
      console.error("Erro ao cadastrar agenda para todos os dias definidos da barbearia", err);
      return res.status(500).json({ Error: "Internal Server Error" });
    }
    if(result){
      const sqlUpdate = "UPDATE agenda SET dom = ?, seg = ?, ter = ?, qua = ?, qui = ?, sex = ?, sab = ? WHERE barbearia_id = ?";
      db.query(sqlUpdate, [value,value,value,value,value,value,value,barbeariaId], (error, resul) =>{
        if(error){
          console.error("Erro ao padronizar os horários de trabalho da barbearia", error);
          return res.status(500).json({ Error: "Internal Server Error" });
        }
        return res.status(200).json({ Success: "Success" });
      })
    }
  })
});


app.post('/api/add-service/:barbeariaId', (req, res) => {
  const barbearia_id = req.params.barbeariaId;
  const name = req.body.nameService;
  const preco = req.body.priceService;
  const duracao = req.body.time;

  const service = {
    name,
    preco,
    duracao,
    barbearia_id
  };

  db.query('INSERT INTO servico SET ?', service, (err, result) =>{
    if(err){
      console.error("Erro ao cadastrar o serviço da barbearia", err);
      return res.status(500).json({ Error: "Internal Server Error" });
    }else{
      if(result){
        return res.status(201).json({ Success: "Success" });
      }
    }
  })

})






/*Send rest to Api-Distance-Matrix-Google
app.post('/reqApiGoogle', async (req, res) => {
    try {
      const apiKey = 'AIzaSyD-reRtGdFi5iiZqqVUeIjAt0HoY4SxNRY';
      const {latUser, lonUser, coordenadasBarbearias } = req.body;
      // Criar um array de strings formatadas para as coordenadas das barbearias
      const destinations = coordenadasBarbearias.map(coord => `${coord.latitude}%2C${coord.longitude}`).join('%7C');

      const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destinations}&origins=${latUser}%2C${lonUser}&mode=walking&key=${apiKey}`;
    
      const response = await fetch(apiUrl);
      const data = await response.json();

      res.json(data);
      //res.send(JSON.stringify(data.rows));
    } catch (error) {
      console.error('Erro na solicitação à API Distance Matrix:', error);
      res.status(500).json({ error: 'Erro na solicitação à API Distance Matrix' });
    }
    
});*/

//Cadastro de ususário com senha criptografada
app.post("/SingUp", async (req, res) => {
  const {name, email, senha} = req.body;

  // Hash da senha antes de salvar no banco de dados
  const user = {
    name,
    email,
    senha
  };

  db.query('INSERT INTO user SET ?', user, (error, results) => {
    if (results) {
      res.status(201).send('Usuário registrado com sucesso');
    } else {
      console.error(error);
      res.status(500).send('Erro ao registrar usuário');
    }
  });
});

//Realizando Login e Gerando Token de autenticação
app.post('/SignIn', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Buscar usuário pelo email
  db.query('SELECT * FROM user WHERE email = ? AND senha = ?', [email, password],
  (err, result) => {
    if(err){
      res.send({err: err});
    }
    if (result.length > 0) {
      const user = result[0];
      // Criação do token
      const token = jwt.sign({ userId: user.id, userEmail: user.email }, process.env.tokenWordSecret, { expiresIn: "1h" });
      // Envie o token no corpo da resposta
      res.status(200).json({ success: true, token: token, user: result });
      
    } else {
      // Usuário não encontrado
      res.status(404).json({success: false, message: 'Usuário não encontrado'});
    }
  });
});

//listando as barbearias cadastradas
app.get('/listBarbearia', async (req, res) => {
  try {
    db.query('SELECT * FROM barbearia', (err, rows) => {
      if (err) throw err;
      res.json(rows);
    });
  } catch (error) {
    console.error('Erro ao obter os registros:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter os registros' });
  }
});

/*listando os Serviços cadastrados pelas barbearias*/
app.get('/listServico', async (req, res)=>{
  try {
    db.query('SELECT * FROM servico', (err, rows) => {
      if (err) throw err;
      res.json(rows);
    });
    } catch (error) {
      console.error('Erro ao obter os registros:', error);
    }
});

//Cadastrando a avaliação do usuário
app.post("/avaliacao", (req, res) => {
  const sql = "INSERT INTO avaliacoes (`user_name`,`barbearia_id`, `estrelas`, `comentarios`, `data_avaliacao`) VALUES (?)";
  const values = [
    req.body.userName,
    req.body.barbeariaId,
    req.body.avaliacao,
    req.body.comentario,
    req.body.data_avaliacao
  ]
  db.query(sql, [values], (err, result) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Erro ao registrar avaliação' });
    } else {
      res.status(201).json({ success: true, message: 'Avaliação registrada com sucesso' });
    }
  });
});

//Buscando a avaliação da barbearia em especifico
app.get('/SearchAvaliation', async(req, res)=>{
  try {
    db.query('SELECT * FROM avaliacoes', (err, rows) => {
      if (err) throw err;
      res.json(rows);
    });
    } catch (error) {
      console.error('Erro ao obter os registros:', error);
    }
});

//Salvando o agendamento feito pelo cliente
app.post('/agendamento', (req, res) => {
  const { selectedDate, selectedTime, selectedService, barbeariaId, userId} = req.body;
  db.query('INSERT INTO agendamentos (dia_agendamento, horario, user_id, barbearia_id, servico_id) VALUES (?, ?, ?, ?, ?)', 
    [selectedDate, selectedTime, userId, barbeariaId, selectedService], 
    (err, results) => {
      if (err) {
        console.error('Erro ao inserir os dados:', err);
        res.status(500).json({ message: 'Erro ao inserir os dados' });
        return;
      }
      res.json({ message: 'Agendamento criado com sucesso' });
  });
});

//RoutesPayment
app.post('/Checkout', async (req, res) => {
  //set API Mercago Pago
  const client = new MercadoPago.MercadoPagoConfig({
    accessToken: process.env.accessTokenMercadoPago,
  });
  
  const preference = new MercadoPago.Preference(client);

  //create preferences
  let body = {
    items:[{
          title: req.body.nameServico,
          quantity: 1,
          currency_id: 'BRL',
          description: req.body.DescricaoServico,
          unit_price: parseFloat(req.body.preco)
    }],
    payer:{
      email: "demo@gmail.com"
    },
    payment_methods:{
      installments:3
    },
    "back_urls": {
      "success": "http://localhost:5173/",
      "failure": "http://localhost:5173/failure",
      "pending": "http://localhost:5173/pending"
  },
  "auto_return": "approved",
  };
  preference.create({ body }).then(function (data) {
    res.send(JSON.stringify(data.init_point));
    //console.log(data);
   }).catch(function (error){
     console.log(error);
   });
 });

app.listen( process.env.portServerNode, () =>{
  console.log(`Servidor está rodando em http://localhost:${process.env.portServerNode}`);
});