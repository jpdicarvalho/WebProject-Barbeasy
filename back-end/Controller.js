import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql";
import MercadoPago from "mercadopago";

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const client = new MercadoPago.MercadoPagoConfig({
  accessToken: 'APP_USR-7433076748534689-103020-f2ad6b84165928b9b0d4732a99d73ce6-752130654',
});
const preference = new MercadoPago.Preference(client);

//Criando conexão com BD MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "barbeasy_two"
});
  console.log('conectado');


//implementar aqui a rota de existência do token

app.post("/SingUp", (req, res) => {
  const sql ="INSERT INTO user (`name`, `email`, `senha`) VALUES (?)";
    const values = [
      req.body.name,
      req.body.email,
      req.body.senha
    ]
    db.query(sql, [values], (err, result) => {
      if(err) return res.json({Error: "Inserting data Error in Server"});
      return res.json({Status: "Success"});
    })
  })
  app.post('/SignIn', async (req, res) => {
    const { email, password } = req.body;

    // Verificar se o email e senha estão corretos
    db.query('SELECT * FROM user WHERE email = ? AND senha = ?', [email, password], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            res.status(500).json({ success: false, message: 'Erro ao fazer login' });
        } else if (results.length > 0) {
            // Usuário encontrado
            res.status(200).json({ success: true, message: 'Login realizado com sucesso!' });
        } else {
            // Usuário não encontrado
            res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
    });
});
//listando as barbearias cadastradas
app.get('/listBarbearia', async(req, res)=>{
  try {
    db.query('SELECT * FROM barbearia', (err, rows) => {
      if (err) throw err;
      res.json(rows);
    });
    } catch (error) {
      console.error('Erro ao obter os registros:', error);
    }
});
/*
=-=-= listando os Serviços cadastrados pelas barbearias =-=-=
Aqui está sendo puxado todos os registros, porém, no Front-End, 
um filtro é aplicado para que apareça apenas os serviços das barbearias selecionadas pelo usuário.
*/
app.get('/listServico', async(req, res)=>{
  try {
    db.query('SELECT * FROM servico', (err, rows) => {
      if (err) throw err;
      res.json(rows);
    });
    } catch (error) {
      console.error('Erro ao obter os registros:', error);
    }
});
//cadastrando a avaliação do usuário
app.post("/avaliacao", (req, res) => {
  const sql = "INSERT INTO avaliacoes (`barbearia_id`, `estrelas`, `comentarios`, `data_avaliacao`) VALUES (?)";
  const values = [
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
  const { selectedDate, selectedTime, selectedService, barbeariaId} = req.body;

  db.query('INSERT INTO agendamentos (data_agendamento, horario, servico_id, barbearia_id) VALUES (?, ?, ?, ?)', 
    [selectedDate, selectedTime, selectedService, barbeariaId], 
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

app.listen(8000, () => {
  console.log("Listening...");
});