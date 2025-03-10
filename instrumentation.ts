import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel({
    serviceName: 'vercel-otel-example',
    experimental: {
      exportViaVercelRuntime: true,
    }
  })
}
