import WebSocket, { WebSocketServer } from 'ws'

const wss = new WebSocketServer({
  port: 3002,
})

wss.on('connection', function connection(ws, req) {
  console.log('server connected')

  const ip = req.socket.remoteAddress

  console.log({ ip })

  ws.on('message', async function message(data) {
    const result = {
      data: data.toString(),
    }

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        result.isSelf = client === ws

        client.send(JSON.stringify(result))
      }
    })
  })
})
