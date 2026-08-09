export interface AppErrorOptions {
  cause?: unknown;
  details?: unknown;
}

export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;
  readonly details?: unknown;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = new.target.name;
    this.details = options.details;
  }
}

export class BadRequestError extends AppError {
  readonly statusCode = 400;
  readonly code = "BAD_REQUEST";

  constructor(message = "Requisição inválida", options?: AppErrorOptions) {
    super(message, options);
  }
}

export class ValidationError extends AppError {
  readonly statusCode = 400;
  readonly code = "VALIDATION_ERROR";

  constructor(message = "Dados inválidos", options?: AppErrorOptions) {
    super(message, options);
  }
}

export class UnauthorizedError extends AppError {
  readonly statusCode = 401;
  readonly code = "UNAUTHORIZED";

  constructor(message = "Não autorizado", options?: AppErrorOptions) {
    super(message, options);
  }
}

export class ForbiddenError extends AppError {
  readonly statusCode = 403;
  readonly code = "FORBIDDEN";

  constructor(message = "Sem permissão", options?: AppErrorOptions) {
    super(message, options);
  }
}

export class NotFoundError extends AppError {
  readonly statusCode = 404;
  readonly code = "NOT_FOUND";

  constructor(message = "Não encontrado", options?: AppErrorOptions) {
    super(message, options);
  }
}

export class ConflictError extends AppError {
  readonly statusCode = 409;
  readonly code = "CONFLICT";

  constructor(message = "Recurso já existe", options?: AppErrorOptions) {
    super(message, options);
  }
}

export class InternalError extends AppError {
  readonly statusCode = 500;
  readonly code = "INTERNAL_ERROR";

  constructor(message = "Erro interno", options?: AppErrorOptions) {
    super(message, options);
  }
}

export class UpstreamError extends AppError {
  readonly code = "UPSTREAM_ERROR";

  constructor(
    readonly statusCode: number,
    message = "Falha na comunicação com serviço externo",
    options?: AppErrorOptions,
  ) {
    super(message, options);
  }
}

export class NetworkError extends AppError {
  readonly statusCode = 0;
  readonly code = "NETWORK_ERROR";

  constructor(
    message = "Falha de rede ao chamar a API",
    options?: AppErrorOptions,
  ) {
    super(message, options);
  }
}

export class TimeoutError extends AppError {
  readonly statusCode = 408;
  readonly code = "TIMEOUT";

  constructor(
    message = "Tempo de espera da requisição excedido",
    options?: AppErrorOptions,
  ) {
    super(message, options);
  }
}

export function httpErrorFromStatus(
  status: number,
  message: string,
  options?: AppErrorOptions,
): AppError {
  switch (status) {
    case 400:
      return new BadRequestError(message, options);
    case 401:
      return new UnauthorizedError(message, options);
    case 403:
      return new ForbiddenError(message, options);
    case 404:
      return new NotFoundError(message, options);
    case 409:
      return new ConflictError(message, options);
    case 500:
      return new InternalError(message, options);
    default:
      return new UpstreamError(status, message, options);
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
