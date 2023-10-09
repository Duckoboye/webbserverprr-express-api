import { Request, Response, NextFunction } from "express";
import { body, validationResult } from 'express-validator';

export const validateCreateAccount = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .notEmpty()
    .withMessage('Password is required'),
  
  // Add any additional validation rules as needed for your specific case.
  // For example, you might want to check for password complexity requirements.
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];