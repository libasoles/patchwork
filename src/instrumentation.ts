import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // @ts-expect-error -- tsc's node16 resolution requires an extension for
    // dynamic imports, but that path doesn't exist on disk; webpack resolves
    // the real .ts file fine without it.
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // @ts-expect-error -- see above
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
