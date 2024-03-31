import { NextFunction, Request, Response } from 'express';

// White list for access
export const whitelistOrigins = [
  'http://localhost:5173',
  'http://localhost:8001',
];

export const corsOptions = {
  origin: function (origin: string, callback: any) {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
    } else if (whitelistOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,
};

export const credentialCors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (whitelistOrigins.includes(req.headers.origin as string)) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  next();
};
