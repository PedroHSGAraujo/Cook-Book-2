const db = require("../routes/db-config");

const getRecipes = (req, res) => {
    db.query('SELECT * FROM receitas WHERE usuario_id = ?', [req.user.id], (err, results) => {
        if (err) throw err;
        res.json({ status: "success", data: results });
    });
};

const addRecipe = (req, res) => {
    const { nome, descricao, ingredientes } = req.body;
    db.query('INSERT INTO receitas SET ?', { nome, descricao, ingredientes, usuario_id: req.user.id }, (err, results) => {
        if (err) throw err;
        res.json({ status: "success", message: "Receita adicionada!" });
    });
};

const editRecipe = (req, res) => {
    const { id, nome, descricao, ingredientes } = req.body;
    db.query('UPDATE receitas SET ? WHERE id = ? AND usuario_id = ?', [{ nome, descricao, ingredientes }, id, req.user.id], (err, results) => {
        if (err) throw err;
        res.json({ status: "success", message: "Receita atualizada!" });
    });
};

const deleteRecipe = (req, res) => {
    const { id } = req.body;
    db.query('DELETE FROM receitas WHERE id = ? AND usuario_id = ?', [id, req.user.id], (err, results) => {
        if (err) throw err;
        res.json({ status: "success", message: "Receita excluída!" });
    });
};

module.exports = { getRecipes, addRecipe, editRecipe, deleteRecipe };