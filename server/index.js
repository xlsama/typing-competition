import WebSocket, { WebSocketServer } from 'ws'
// import { write, read } from './db'

const wss = new WebSocketServer({
  port: 3002,
})

wss.on('connection', function connection(ws) {
  console.log('server connected')

  ws.on('message', async function message(data) {
    const dataStr = data.toString()
    const params = {
      content: dataStr,
      isSelf: false,
    }

    console.log('params:', params)

    // read(params)
    //write(params)

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        const isSelf = client === ws
        if (isSelf) {
          params.isSelf = true
        }

        client.send(JSON.stringify(params))
      }
    })
  })
})
