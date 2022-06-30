import WebSocket, { WebSocketServer } from 'ws'

const wss = new WebSocketServer({
  port: 3002,
})

wss.users = []

wss.on('connection', function connection(ws, req) {
  console.log('server connected')

  wss.users.push({
    id: wss.users.length + 1,
    ip: req.socket.remoteAddress,
  })

  ws.on('message', async function message(data) {
    const result = { data: data.toString() }

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        result.isSelf = client === ws

        client.send(JSON.stringify(result))
      }
    })
  })
})
