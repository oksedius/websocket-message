const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 8080 });

console.log("WS server running on ws://localhost:8080");

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "hello" }));

  ws.on("message", (data) => {
    try {
      const parsed = JSON.parse(data.toString());

      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(
            JSON.stringify({
              type: "message",
              data: {
                id: String(Date.now() + Math.random()),
                text: parsed.text,
                createdAt: new Date().toISOString(),
              },
            }),
          );
        }
      });
    } catch {
      ws.send(
        JSON.stringify({
          type: "error",
          data: { message: "Invalid message format" },
        }),
      );
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
