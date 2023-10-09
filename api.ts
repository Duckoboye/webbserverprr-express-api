import express, { Router, Request, Response, NextFunction } from 'express';
import {body, check, validationResult} from 'express-validator'
import {createAccount, deleteAccount, getUser, getUsers, putChangeAccount} from './api/controllers/users'
import {validateCreateAccount, validateUserIdParam} from './api/validators/validators' 

const router: Router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id',validateUserIdParam, getUser);
router.post('/users', validateCreateAccount, createAccount);
router.put('/users/:id', putChangeAccount);
router.delete('/users/:id', deleteAccount);

export default router;
