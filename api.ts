import express, { Router, Request, Response } from 'express';
import { createSuccessResponse, createErrorResponse } from './responses'; // Create a module for response handling.
import { executeQuery } from './database'; // Create a separate module for database connection.
import {readFile, ChangeName} from './utils'
const path: string = "./test.json";

const router: Router = express.Router();

router.get('/get_sql', async (req: Request, res: Response) => {
    try {
        const queryResult = await executeQuery('SELECT * FROM employees LIMIT 5;');
        res.json(queryResult);
    } catch (error: any) {
        
        res.status(500).json(createErrorResponse(error.message));
    }
});

router.get('/who_needs_sql_injection', async (req: Request, res: Response) => {
    const query = req.query.query as string | undefined;

    if (!query) {
        return res.status(400).json(createErrorResponse('Welcome to the SQL API. Please input your SQL queries to be run unsanitized on the SQL server using the "query" query parameter. Example: "http://example.org?query=<myquery>" Have fun :)'));
    }
    try {
        const queryResult = await executeQuery(query);
        res.status(200).json(createSuccessResponse(queryResult));
    } catch (error: any) {
        res.status(500).json(createErrorResponse(error));
    }
});

router.get('/users', async (req: Request, res: Response) => {
    try {
        const queryResult = await executeQuery('SELECT * FROM accounts;');
        res.json(createSuccessResponse(queryResult));
    } catch (error) {
        res.status(500).json(createErrorResponse('Internal Server Error'));
    }
});

router.get('/users/:id', async (req: Request, res: Response) => {
    const userId: string = req.params.id;

    try {
        const queryResult = await executeQuery(`SELECT * FROM accounts WHERE account_id = ${userId};`);
        if (queryResult.length === 0) {
            return res.status(404).json(createErrorResponse( 'Account not found' ));
        } else {
            res.json(createSuccessResponse(queryResult[0]));
        }
    } catch (error) {
        res.status(500).json(createErrorResponse('Internal Server Error'));
    }
});

router.post('/users', async (req: Request, res: Response) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json(createErrorResponse('Name and email are required' ));
    }

    try {
        // Insert the new user into the database and retrieve the inserted ID.
        const result = await executeQuery(`INSERT INTO accounts (username, email) VALUES ('${name}', '${email}');`);
        const insertedUserId = result.insertId;

        // Retrieve the created user's data and return it as a response.
        const createdUser = await executeQuery(`SELECT * FROM accounts WHERE account_id = ${insertedUserId};`);
        res.json(createSuccessResponse(createdUser[0]));
    } catch (error: any) {
        res.status(500).json(createErrorResponse(error));
    }
});

router.put('/users/:id', async (req: Request, res: Response) => {
    const userId: string = req.params.id;
    const { name, email } = req.body;

    try {
        // Check if the user exists.
        const userExists = await executeQuery(`SELECT * FROM accounts WHERE account_id = ${userId};`);
        if (userExists.length === 0) {
            return res.status(404).json(createErrorResponse( 'User not found' ));
        }

        // Update the user's information.
        await executeQuery(`UPDATE accounts SET username = '${name}', email = '${email}' WHERE account_id = ${userId};`);

        // Retrieve and return the updated user's data.
        const updatedUser = await executeQuery(`SELECT * FROM accounts WHERE account_id = ${userId};`);
        res.json(createSuccessResponse(updatedUser[0]));
    } catch (error: any) {
        return res.status(500).json(createErrorResponse(error));
    }
});

router.delete('/users/:id', async (req: Request, res: Response) => {
    const userId: string = req.params.id;

    try {
        // Check if the user exists.
        const userExists = await executeQuery(`SELECT * FROM accounts WHERE account_id = ${userId};`);
        if (userExists.length === 0) {
            return res.status(404).json(createErrorResponse( 'User not found' ));
        }

        // Delete the user from the database.
        await executeQuery(`DELETE FROM accounts WHERE account_id = ${userId};`);
        res.json(createSuccessResponse('User deleted successfully' ));
    } catch (error: any) {
        return res.status(500).json(createErrorResponse(error));
    }
});

export default router;
