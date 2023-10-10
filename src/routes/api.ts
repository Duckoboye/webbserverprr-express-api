import { Router } from 'express';
import {createAccount, deleteAccount, getUser, getUsers, putChangeAccount} from '../controllers/users'
import {validateCreateAccount, validateUserIdParam} from '../validators/validators' 

const router: Router = Router();

router.get('/users', getUsers);
router.get('/users/:id',validateUserIdParam, getUser);
router.post('/users', validateCreateAccount, createAccount);
router.put('/users/:id', putChangeAccount);
router.delete('/users/:id', deleteAccount);

export default router;
