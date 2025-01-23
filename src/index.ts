import { Request, Response, NextFunction } from 'express';
import { database } from './database';

// Definição da interface para estender o objeto Request
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

// Interface personalizada estendendo a interface padrão Request
interface CustomRequest extends Request {
  petshop?: Petshop;
}

function checkExistsUserAccount(req: CustomRequest, res: Response, next: NextFunction) {
    const cnpj = req.headers.cnpj as string | undefined;
  
    if (!cnpj) {
      return res.status(400).json({ error: 'CNPJ é obrigatório no header.' });
    }
  
    const petshop = database.petshops.find((petshop) => petshop.cnpj === cnpj);
  
    if (!petshop) {
      return res.status(404).json({ error: 'Petshop não encontrado.' });
    }
  
    req.petshop = petshop;
    return next();
}  

export { checkExistsUserAccount };