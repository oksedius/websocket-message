const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 8080 });

console.log("WS server running on ws://localhost:8080");

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "hello" }));

  const timer = setInterval(() => {
    const random = Math.random();

    if (random < 0.6) {
      ws.send(
        JSON.stringify({
          type: "message",
          data: {
            id: String(Date.now() + Math.random()),
            text: "Ping " + new Date().toLocaleTimeString(),
            createdAt: new Date().toISOString(),
          },
        }),
      );
    } else if (random < 0.75) {
      ws.send(
        JSON.stringify({
          type: "system",
          data: {
            text: "System event at " + new Date().toLocaleTimeString(),
            createdAt: new Date().toISOString(),
          },
        }),
      );
    } else if (random < 0.9) {
      ws.send(
        JSON.stringify({
          type: "error",
          data: { message: "Random server warning" },
        }),
      );
    }
  }, 2000);

  ws.on("close", () => clearInterval(timer));
});
