import { JustTCG } from "justtcg-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type TraceEntry = {
  details?: unknown;
  durationSincePreviousMs: number;
  durationSinceStartMs: number;
  stage: string;
  timestamp: string;
};

const REQUEST_TIMEOUT_MS = 30_000;
const traceEntries: TraceEntry[] = [];
const startedAt = Date.now();
let previousAt = startedAt;

class ProviderTimeout extends Error {
  readonly code = "ProviderTimeout";

  constructor(timeoutMs: number) {
    super(`ProviderTimeout: JustTCG request exceeded ${timeoutMs}ms.`);
    this.name = "ProviderTimeout";
  }
}

function trace(stage: string, details?: unknown) {
  const now = Date.now();
  const entry = {
    details: snapshotTraceDetails(details),
    durationSincePreviousMs: now - previousAt,
    durationSinceStartMs: now - startedAt,
    stage,
    timestamp: new Date(now).toISOString(),
  };
  traceEntries.push(entry);
  previousAt = now;
  console.log(JSON.stringify(entry));
}

function snapshotTraceDetails(details: unknown) {
  if (details === undefined) {
    return undefined;
  }

  try {
    return JSON.parse(JSON.stringify(details)) as unknown;
  } catch {
    return details;
  }
}

async function main() {
  loadLocalEnv();
  trace("Standalone test starting", {
    sdkPackage: "justtcg-js",
    timeoutMs: REQUEST_TIMEOUT_MS,
  });

  const apiKey = process.env.JUSTTCG_API_KEY;

  if (!apiKey) {
    throw new Error("Authentication error: JUSTTCG_API_KEY is not set.");
  }

  const restoreFetch = installFetchDiagnostics();

  try {
    trace("SDK instantiated");
    const client = new JustTCG({ apiKey });

    trace("Request starting");
    trace("Endpoint being called", {
      endpoint: "https://api.justtcg.com/v1/cards",
      method: "GET",
      sdkMethod: "client.v1.cards.get",
    });

    const requestParameters = {
      game: "Magic: The Gathering",
      query: "Mox Opal",
      limit: 1,
    };
    trace("Request parameters", requestParameters);

    const result = await withTimeout(
      client.v1.cards.get(requestParameters),
      REQUEST_TIMEOUT_MS,
    );

    trace("SDK request completed", {
      cardCount: result.data.length,
      hasPagination: Boolean(result.pagination),
      hasUsage: Boolean(result.usage),
      latencyMs: Date.now() - startedAt,
    });
    console.dir(result, { depth: null });
  } catch (error) {
    trace("SDK request failed", classifyError(error));
    console.error(JSON.stringify({
      error: classifyError(error),
      latencyMs: Date.now() - startedAt,
      trace: traceEntries,
    }, null, 2));
    throw error;
  } finally {
    restoreFetch();
  }
}

function loadLocalEnv() {
  const envPath = resolve(process.cwd(), ".env.local");

  try {
    const envFile = readFileSync(envPath, "utf8");

    for (const line of envFile.split("\n")) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");
      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed
        .slice(separatorIndex + 1)
        .trim()
        .replace(/^['"]|['"]$/g, "");

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    return;
  }
}

function installFetchDiagnostics() {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async (input, init) => {
    const request = new Request(input, init);
    trace("HTTP request initiated", {
      method: request.method,
      url: request.url,
    });

    try {
      const response = await originalFetch(input, init);
      trace("HTTP response received", {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      });
      trace("Response status", {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      });
      trace("Response headers (safe only)", getSafeResponseHeaders(response.headers));
      trace("Response body (safe)", await readSafeResponseBody(response));
      return response;
    } catch (error) {
      trace("HTTP request failed", classifyNetworkError(error));
      throw error;
    }
  }) as typeof globalThis.fetch;

  return () => {
    globalThis.fetch = originalFetch;
  };
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new ProviderTimeout(timeoutMs)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

function getSafeResponseHeaders(headers: Headers) {
  const safeHeaderNames = [
    "content-type",
    "date",
    "retry-after",
    "x-ratelimit-limit",
    "x-ratelimit-remaining",
    "x-ratelimit-reset",
    "x-request-id",
  ];

  return safeHeaderNames.reduce<Record<string, string>>((safeHeaders, name) => {
    const value = headers.get(name);
    if (value) {
      safeHeaders[name] = value;
    }
    return safeHeaders;
  }, {});
}

async function readSafeResponseBody(response: Response) {
  try {
    const text = await response.clone().text();
    const truncated = text.length > 4_000;
    const body = truncated ? `${text.slice(0, 4_000)}... [truncated]` : text;

    return {
      body: parseJsonIfPossible(body),
      truncated,
    };
  } catch (error) {
    return {
      bodyReadError: serializeError(error),
    };
  }
}

function parseJsonIfPossible(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function classifyError(error: unknown) {
  const status = getLatestResponseStatus();
  const body = getLatestResponseBody();
  const message = error instanceof Error ? error.message : "Unknown SDK error.";

  return {
    authenticationFailure:
      status === 401 || message.toLowerCase().includes("api key"),
    authorizationFailure: status === 403,
    connectionFailure: isConnectionFailure(error),
    dnsFailure: isDnsFailure(error),
    endpointMismatch: status === 404,
    httpStatus: status,
    providerErrorCode: typeof body?.code === "string" ? body.code : null,
    providerErrorMessage:
      typeof body?.error === "string" ? body.error : message,
    rateLimiting: status === 429,
    sdkError: serializeError(error),
    timeout: error instanceof ProviderTimeout,
  };
}

function classifyNetworkError(error: unknown) {
  return {
    connectionFailure: isConnectionFailure(error),
    dnsFailure: isDnsFailure(error),
    sdkError: serializeError(error),
  };
}

function getLatestResponseStatus() {
  const details = [...traceEntries]
    .reverse()
    .find((entry) => entry.stage === "Response status")?.details;

  if (details && typeof details === "object" && "status" in details) {
    return Number(details.status);
  }

  return null;
}

function getLatestResponseBody() {
  const details = [...traceEntries]
    .reverse()
    .find((entry) => entry.stage === "Response body (safe)")?.details;

  if (
    details &&
    typeof details === "object" &&
    "body" in details &&
    details.body &&
    typeof details.body === "object"
  ) {
    return details.body as Record<string, unknown>;
  }

  return null;
}

function isDnsFailure(error: unknown) {
  return getCauseCode(error) === "ENOTFOUND" || getCauseCode(error) === "EAI_AGAIN";
}

function isConnectionFailure(error: unknown) {
  const code = getCauseCode(error);
  return Boolean(
    code &&
      ["ECONNRESET", "ECONNREFUSED", "ENETUNREACH", "ETIMEDOUT"].includes(code),
  );
}

function getCauseCode(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "cause" in error &&
    error.cause &&
    typeof error.cause === "object" &&
    "code" in error.cause
  ) {
    return String(error.cause.code);
  }

  return null;
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      cause: serializeCause(error.cause),
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
  }

  return error;
}

function serializeCause(cause: unknown) {
  if (!cause || typeof cause !== "object") {
    return cause;
  }

  return Object.fromEntries(
    Object.entries(cause).map(([key, value]) => [key, String(value)]),
  );
}

main().catch(() => {
  process.exitCode = 1;
});
