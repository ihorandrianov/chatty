import z from "zod";

export class NetError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super();
  }
}

export const errorResponseSchema = z.object({
  message: z.string(),
  code: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export type ErrorResponse = {
  message: string;
  code: string;
  details?: Record<string, unknown>;
};
