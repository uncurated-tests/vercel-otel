import { registerOTel } from '@vercel/otel'
import { SimpleSpanProcessor, SpanExporter } from '@opentelemetry/sdk-trace-base'
import { createExportTraceServiceRequest } from "@opentelemetry/otlp-transformer";
import { SpanContext } from "@opentelemetry/api";
import { IExportTraceServiceRequest } from "@opentelemetry/otlp-transformer";

interface Reader {
  get: () => {
    telemetry: TelemetryContext;
  };
}

interface TelemetryContext {
  rootSpanContext: SpanContext;
  reportSpans: (data: IExportTraceServiceRequest) => void;
}

const symbol = Symbol.for("@vercel/request-context");
const requestContext = () =>
  (globalThis as { [symbol]?: Reader })[symbol]?.get();

export function register() {
  const spanExporter: SpanExporter = {
    export: (spans, resultCallback) => {
      // Converts a Span to IResourceSpans > IScopeSpans > ISpan structure, which
      // is OTLP format. It's can be directly serialized to JSON or converted
      // to Protobuf.
      const data = createExportTraceServiceRequest(spans, {
        // Uses hex-encoding trace and span IDs. Otherwise, base64 is used.
        useHex: true,
        // Uses `{high, low}` format for timestamps. Otherwise, `unixNanon` is used.
        // TODO Fix this
        useLongBits: false,
      });

      const context = requestContext();
      context?.telemetry.reportSpans(data);
      // console.log("[OTEL]", JSON.stringify(data));
      resultCallback({ code: 0, error: undefined });
    },
    shutdown: () => {
      return Promise.resolve();
    },
  }

  const spanProcessor = new SimpleSpanProcessor(spanExporter);

  registerOTel({
    serviceName: 'vercel-otel-example',
    spanProcessors: [spanProcessor]
  })
}
