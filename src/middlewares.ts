import { Request, Response, NextFunction } from 'express';
import { database } from './database';

interface Pet {
    id: string;
    name: string;
    type: string;
    description: string;
    vaccinated: boolean;
    deadline_vaccination: Date;
    created_at: Date;
}
  
interface Petshop {
    id: string;
    name: string;
    cnpj: string;
    pets: Pet[];
}

function checkExistsUserAccount(req: Request, res: Response, next: NextFunction): Response | void {
  const { cnpj } = req.headers;

  if (!cnpj) {
    return res.status(400).json({ error: 'CNPJ é obrigatório no header.' });
  }

  const petshop = (database.petshops as Petshop[]).find(petshop => petshop.cnpj === cnpj);

  if (!petshop) {
    return res.status(404).json({ error: 'Petshop não encontrado.' });
  }

  req.petshop = petshop;
  return next();
}

export { checkExistsUserAccount };