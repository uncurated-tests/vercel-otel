import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel({
    serviceName: 'vercel-otel-example',
    spanProcessors: ['auto', 'experimental-vercel-trace'],
  })
}
