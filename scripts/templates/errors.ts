import type { Problem } from "./models/Problem";

export type AffinityErrorCategory =
  | "authentication"
  | "permission"
  | "invalid_request"
  | "idempotency"
  | "rate_limit"
  | "api"
  | "connection";

export interface AffinityErrorSummary {
  category: AffinityErrorCategory;
  code: string;
  message: string;
  requestId?: string;
  retryable: boolean;
  statusCode?: number;
}

interface AffinityErrorOptions {
  cause?: unknown;
  category: AffinityErrorCategory;
  code: string;
  problem?: Problem;
  requestId?: string;
  response?: Response;
  retryable?: boolean;
  statusCode?: number;
  traceId?: string;
}

export class AffinityError extends Error {
  override readonly name: string = "AffinityError";
  readonly category: AffinityErrorCategory;
  readonly code: string;
  readonly problem?: Problem;
  readonly requestId?: string;
  readonly response?: Response;
  readonly retryable: boolean;
  readonly statusCode?: number;
  readonly traceId?: string;

  constructor(message: string, options: AffinityErrorOptions) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.category = options.category;
    this.code = options.code;
    this.problem = options.problem;
    this.requestId = options.requestId;
    this.response = options.response;
    this.retryable = options.retryable ?? false;
    this.statusCode = options.statusCode;
    this.traceId = options.traceId;
  }

  toJSON(): AffinityErrorSummary {
    return {
      category: this.category,
      code: this.code,
      message: this.message,
      ...(this.requestId ? { requestId: this.requestId } : {}),
      retryable: this.retryable,
      ...(this.statusCode !== undefined ? { statusCode: this.statusCode } : {}),
    };
  }
}

export class AffinityAuthenticationError extends AffinityError {
  override readonly name = "AffinityAuthenticationError";
}
export class AffinityPermissionError extends AffinityError {
  override readonly name = "AffinityPermissionError";
}
export class AffinityInvalidRequestError extends AffinityError {
  override readonly name = "AffinityInvalidRequestError";
}
export class AffinityIdempotencyError extends AffinityError {
  override readonly name = "AffinityIdempotencyError";
}
export class AffinityRateLimitError extends AffinityError {
  override readonly name = "AffinityRateLimitError";
}
export class AffinityApiError extends AffinityError {
  override readonly name = "AffinityApiError";
}
export class AffinityConnectionError extends AffinityError {
  override readonly name = "AffinityConnectionError";
}

export function isAffinityError(error: unknown): error is AffinityError {
  return error instanceof AffinityError;
}

export async function affinityErrorFromResponse(response: Response): Promise<AffinityError> {
  const problem = await readProblem(response);
  const statusCode = response.status;
  const code = problem?.code ?? `http_${statusCode}`;
  const message =
    problem?.detail || response.statusText || `Affinity API request failed (${statusCode})`;
  const options = {
    category: categoryFor(statusCode, code),
    code,
    ...(problem ? { problem } : {}),
    ...(problem?.requestId ? { requestId: problem.requestId } : {}),
    response,
    retryable: [408, 429, 500, 502, 503, 504].includes(statusCode),
    statusCode,
    ...(problem?.traceId ? { traceId: problem.traceId } : {}),
  } satisfies AffinityErrorOptions;

  if (options.category === "authentication")
    return new AffinityAuthenticationError(message, options);
  if (options.category === "permission") return new AffinityPermissionError(message, options);
  if (options.category === "invalid_request")
    return new AffinityInvalidRequestError(message, options);
  if (options.category === "idempotency") return new AffinityIdempotencyError(message, options);
  if (options.category === "rate_limit") return new AffinityRateLimitError(message, options);
  return new AffinityApiError(message, options);
}

export function affinityConnectionError(
  cause: unknown,
  options: { timedOut: boolean },
): AffinityConnectionError {
  return new AffinityConnectionError(
    options.timedOut ? "Affinity API request timed out" : "Could not connect to the Affinity API",
    {
      cause,
      category: "connection",
      code: options.timedOut ? "request_timeout" : "connection_error",
      retryable: true,
    },
  );
}

function categoryFor(status: number, code: string): AffinityErrorCategory {
  if (status === 401) return "authentication";
  if (status === 403) return "permission";
  if (status === 429) return "rate_limit";
  if (status === 409 && code.includes("idempot")) return "idempotency";
  if ([400, 404, 409, 410, 413, 422].includes(status)) return "invalid_request";
  return "api";
}

async function readProblem(response: Response): Promise<Problem | undefined> {
  try {
    const value: unknown = await response.clone().json();
    if (
      !isRecord(value) ||
      typeof value.code !== "string" ||
      typeof value.detail !== "string" ||
      typeof value.instance !== "string" ||
      typeof value.requestId !== "string" ||
      typeof value.status !== "number" ||
      typeof value.title !== "string" ||
      typeof value.type !== "string"
    ) {
      return undefined;
    }
    return value as unknown as Problem;
  } catch {
    return undefined;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
