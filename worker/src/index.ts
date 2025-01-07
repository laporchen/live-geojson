import { DurableObject } from 'cloudflare:workers'
import crossws from 'crossws/adapters/cloudflare-durable'
import { createHandler } from 'y-crossws'

// Durable Object Name is forced unless we can fit service name prop in `crossws`
// @ts-expect-error type error
const ws = crossws(createHandler())

export class $DurableObject extends DurableObject {
	constructor(state: DurableObjectState, env: any) {
    super(state, env);
    ws.handleDurableInit(this, state, env)
  }

	fetch(request: Request) {
    return ws.handleDurableUpgrade(this, request)
  }
  webSocketMessage(client: WebSocket, message: string) {
    return ws.handleDurableMessage(this, client, message)
  }
  webSocketClose(client: WebSocket, code: number, reason: string, wasClean: boolean) {
    return ws.handleDurableClose(this, client, code, reason, wasClean)
  }
}

export default {
	async fetch(request: Request, env, context) {
    if (request.headers.get('upgrade') === 'websocket') {
      return ws.handleUpgrade(request as any, env, context)
    }
    return new Response('', { status: 426 })
  }
} satisfies ExportedHandler<Env>
