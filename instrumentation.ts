import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel('vercel-otel-example')
}
