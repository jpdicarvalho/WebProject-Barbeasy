import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

//Criando conexão com BD MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "barbeasy_two"
});
  console.log('conectado');

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
});
app.post('/SingIn', async (req, res)=>{
  const sql = "SELECT * FROM user WHERE email = ? AND senha =?";
  db.query(sql, [req.body.email, req.body.senha], (err, data) =>{
    if(err) return res.json("Login Falied");
    if(data.length > 0){
      return res.json("Login Successfully")
    }else{
      return res.json("no record")
    }
  })
});

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

app.listen(8000, () => {
  console.log("Listening...");
});