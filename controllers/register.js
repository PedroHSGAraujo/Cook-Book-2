const db = require("../routes/db-config");
const bcrypt = require("bcryptjs");

const register = async(req,res) => {
    const {nome, email, password:Npassword} = req.body;
    if(!email || !Npassword || !nome) return res.json({status:"error", error:"Por favor insira seu nome, e-mail ou sua senha"});
    else{
        db.query('SELECT email FROM usuarios WHERE email = ?', [email], async (err, results) =>{
            if (err) throw err;
            if (results[0]) return res.json({status:"error", error:"E-mail já registrado"});
            else{
                const password = await bcrypt.hash(Npassword, 8);
                db.query('INSERT INTO usuarios SET ?', {nome: nome, email: email, senha: password}, (error, results) => {
                    if(error) throw error;
                    return res.json({status:"success", success:"Usuário Registrado!"});
                });
            }
        })
    }
}

module.exports = register;