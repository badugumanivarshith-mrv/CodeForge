import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodTypeAny } from 'zod';

export interface RequestValidators {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

export const validateRequest = (schemaOrValidators: RequestValidators | AnyZodObject | ZodTypeAny) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (
        schemaOrValidators &&
        'parseAsync' in schemaOrValidators &&
        typeof (schemaOrValidators as any).parseAsync === 'function'
      ) {
        const parsed: any = await (schemaOrValidators as any).parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        if (parsed.body !== undefined) req.body = parsed.body;
        if (parsed.query !== undefined) req.query = parsed.query;
        if (parsed.params !== undefined) req.params = parsed.params;
      } else {
        const validators = schemaOrValidators as RequestValidators;
        if (validators.body) {
          req.body = await validators.body.parseAsync(req.body);
        }
        if (validators.query) {
          req.query = await validators.query.parseAsync(req.query);
        }
        if (validators.params) {
          req.params = await validators.params.parseAsync(req.params);
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
