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

router.get('/foo', (req: Request, res: Response) => {
    res.json(createSuccessResponse(ChangeName('foo', path)));
});

router.get('/bar', (req: Request, res: Response) => {
    res.json(createSuccessResponse(ChangeName('bar', path)));
});

router.get('/change', (req: Request, res: Response) => {
    const { name } = readFile(path);
    res.json(createSuccessResponse(ChangeName(name === 'foo' ? 'bar' : 'foo', path)));
});


export default router;
