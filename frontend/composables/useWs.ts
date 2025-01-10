import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
export default function useWs() {
  
  function initWs(protocol: 'ws' | 'wss', server: string, roomId = 'public') {
    const doc = new Y.Doc()
    /*
    const runtime = useRuntimeConfig()
    const url = `${protocol}://${runtime.public.server}`
    */
    const url = `${protocol}://${server}/api/yjs`
    const wsProvider = new WebsocketProvider(url, roomId, doc)
    return { wsProvider, doc }
  }

  return {
    initWs
  }
}
