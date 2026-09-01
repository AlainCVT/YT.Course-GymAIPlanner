import { RequestHandler } from 'express';
import z, { ZodType } from 'zod';

export const validateMiddleware = <Output>(schema: ZodType<Output>): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formatted = z.flattenError(result.error);

      const errors = [
        ...formatted.formErrors,
        ...Object.entries(formatted.fieldErrors).map((errors) =>
          errors.flatMap((errors) => errors ?? []),
        ),
      ];

      return res.status(400).json({ messages: errors });
    }

    next();
  };
};
