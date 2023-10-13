import express, { NextFunction, Request, Response } from 'express';
export declare const authenticateUser: (req: Request, res: Response, next: NextFunction) => Promise<express.Response<any, Record<string, any>> | undefined>;
