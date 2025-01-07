import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
export default function useWs() {
  
  function initWs(protocol: 'ws' | 'wss') {
    const runtime = useRuntimeConfig()
    const doc = new Y.Doc()
    const url = `${protocol}://${runtime.public.server}`
    const wsProvider = new WebsocketProvider(url, 'public', doc)
    return wsProvider
  }

  return {
    initWs
  }
}
