const { database } = require('./database');

function checkExistsUserAccount(req, res, next) {
  const { cnpj } = req.headers;

  if (!cnpj) {
    return res.status(400).json({ error: 'CNPJ é obrigatório no header.' });
  }

  const petshop = database.petshops.find(petshop => petshop.cnpj === cnpj);

  if (!petshop) {
    return res.status(404).json({ error: 'Petshop não encontrado.' });
  }

  req.petshop = petshop;
  return next();
}

module.exports = { checkExistsUserAccount };