// src/types/express.d.ts

declare namespace Express {
    export interface Request {
      user?: any; // Add the 'user' property (with the correct type if known)
    }
  }
  