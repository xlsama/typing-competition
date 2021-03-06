import WebSocket, { WebSocketServer } from 'ws'

const wss = new WebSocketServer({
  port: 3012,
})

let users = []

wss.on('connection', (ws, req) => {
  console.log('server connected')

  const ip = req.socket.remoteAddress

  if (!users.map(user => user.ip).includes(ip)) {
    users.push({
      id: users.length + 1,
      ip,
    })
  }

  ws.on('close', () => {
    console.log('closed')
    users = users.filter(user => user.ip !== ip)
  })

  ws.on('message', async function message(data) {
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
