const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// Banco de dados em memória
const database = {
  petshops: []
};

// Função para validar CNPJ
function isValidCNPJ(cnpj) {
  const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return cnpjRegex.test(cnpj);
}

/**
 * Rotas
 */

// Criar Petshop
app.post('/petshops', (req, res) => {
  const { name, cnpj } = req.body;

  // Validação do CNPJ
  if (!isValidCNPJ(cnpj)) {
    return res.status(400).json({ error: `CNPJ inválido. O formato deve ser XX.XXX.XXX/XXXX-XX. O informado foi ${cnpj}` });
  }

  // Verificar se o Petshop já existe
  const petshopExists = database.petshops.some(petshop => petshop.cnpj === cnpj);
  if (petshopExists) {
    return res.status(400).json({ error: 'Petshop já cadastrado.' });
  }

  const newPetshop = {
    id: uuidv4(),
    name,
    cnpj,
    pets: []
  };

  database.petshops.push(newPetshop);
  return res.status(201).json(newPetshop);
});

// Listar todos os Petshops
app.get('/petshops', (req, res) => {
  return res.json(database.petshops);
});

// Listar Pets de um Petshop específico
app.get('/petshops/:id/pets', (req, res) => {
  const { id } = req.params;

  const petshop = database.petshops.find(petshop => petshop.id === id);
  if (!petshop) {
    return res.status(404).json({ error: 'Petshop não encontrado.' });
  }

  return res.json(petshop.pets);
});

// Adicionar Pet a um Petshop
app.post('/petshops/:id/pets', (req, res) => {
  const { id } = req.params;
  const { name, type, description, deadline_vaccination } = req.body;

  const petshop = database.petshops.find(petshop => petshop.id === id);
  if (!petshop) {
    return res.status(404).json({ error: 'Petshop não encontrado.' });
  }

  const newPet = {
    id: uuidv4(),
    name,
    type,
    description,
    vaccinated: false,
    deadline_vaccination: new Date(deadline_vaccination),
    created_at: new Date()
  };

  petshop.pets.push(newPet);
  return res.status(201).json(newPet);
});

// Atualizar Pet de um Petshop
app.put('/petshops/:id/pets/:petId', (req, res) => {
  const { id, petId } = req.params;
  const { name, type, description, deadline_vaccination } = req.body;

  const petshop = database.petshops.find(petshop => petshop.id === id);
  if (!petshop) {
    return res.status(404).json({ error: 'Petshop não encontrado.' });
  }

  const pet = petshop.pets.find(pet => pet.id === petId);
  if (!pet) {
    return res.status(404).json({ error: 'Pet não encontrado.' });
  }

  Object.assign(pet, {
    name,
    type,
    description,
    deadline_vaccination: new Date(deadline_vaccination)
  });

  return res.json(pet);
});

// Deletar Pet de um Petshop
app.delete('/petshops/:id/pets/:petId', (req, res) => {
  const { id, petId } = req.params;

  const petshop = database.petshops.find(petshop => petshop.id === id);
  if (!petshop) {
    return res.status(404).json({ error: 'Petshop não encontrado.' });
  }

  const petIndex = petshop.pets.findIndex(pet => pet.id === petId);
  if (petIndex === -1) {
    return res.status(404).json({ error: 'Pet não encontrado.' });
  }

  petshop.pets.splice(petIndex, 1);
  return res.status(200).json({ message: 'Pet removido com sucesso.' });
});

/**
 * Iniciar servidor
 */

app.listen(3333, () => {
  console.log('🚀 Server running on http://localhost:3333');
});
