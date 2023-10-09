import { createSuccessResponse, createErrorResponse } from "../../responses";
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt'
import pool from '../../database'


export const getUsers = async (req: Request, res: Response) => {
    try {
        const [queryResult] = await pool.query('SELECT * FROM accounts;');
        res.json(createSuccessResponse(queryResult));
    } catch (error) {
        res.status(500).json(createErrorResponse('Internal Server Error'));
    }
}
export const getUser = async (req: Request, res: Response) => {
    const userId: string = req.params.id;

    try {
        const [queryResult] = await pool.query(`SELECT * FROM accounts WHERE account_id = ?;`, [userId]);
        if (queryResult.length === 0) {
            return res.status(404).json(createErrorResponse( 'Account not found' ));
        } else {
            res.json(createSuccessResponse(queryResult[0]));
        }
    } catch (error) {
        res.status(500).json(createErrorResponse('Internal Server Error'));
    }
}

export const createAccount = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
        // Check email uniqueness (you may want to move this check to a middleware)
        const [existingUser] = await pool.query('SELECT * FROM accounts WHERE email = ?', [email]);
        if (existingUser.length > 0) {
          return res.status(400).json({ message: 'Email already exists' });
        }
    
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        // Insert user into the database
        await pool.query('INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    
        res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    };
    
export const putChangeAccount = async (req: Request, res: Response) => {
    const userId: string = req.params.id;
    const { name, email } = req.body;

    try {
        // Check if the user exists.
        const [userExists] = await pool.query('SELECT * FROM accounts WHERE account_id = ?;', [userId]);
        if (userExists.length === 0) {
            return res.status(404).json(createErrorResponse( 'User not found' ));
        }

        // Update the user's information.
        await pool
            .query('UPDATE accounts SET username = ?, email = ? WHERE account_id = ?;', [name, email, userId]);

        // Retrieve and return the updated user's data.
        const [updatedUser] = await pool.query('SELECT * FROM accounts WHERE account_id = ?;', [userId]);
        res.json(createSuccessResponse(updatedUser[0]));
    } catch (error: any) {
        return res.status(500).json(createErrorResponse(error));
    }
}

export const deleteAccount = async (req: Request, res: Response) => {
    const userId: string = req.params.id;
    try {
        // Check if the user exists.
        const [userExists] = await pool.query('SELECT * FROM accounts WHERE account_id = ?', [userId]);
        if (userExists.length === 0) {
            return res.status(404).json(createErrorResponse( 'User not found' ));
        }

        // Delete the user from the database.
        await pool.query('DELETE FROM accounts WHERE account_id = ?', [userId]);
        res.json(createSuccessResponse('User deleted successfully' ));
    } catch (error: any) {
        return res.status(500).json(createErrorResponse(error));
    }
}