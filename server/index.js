import WebSocket, { WebSocketServer } from 'ws'

const wss = new WebSocketServer({
  port: 3002,
})

const users = []

wss.on('connection', function connection(ws, req) {
  console.log('server connected')

  const ip = req.socket.remoteAddress

  users.push({
    id: users.length + 1,
    ip,
  })

  ws.on('message', async function message(data) {
    // console.log(users)

    let result = { data: data.toString() }
    const { id } = users.find(user => user.ip === ip)

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        const params = {
          isSelf: client === ws,
          id,
        }
        result = { ...result, ...params }

        client.send(JSON.stringify(result))
      }
    })
  })
})
