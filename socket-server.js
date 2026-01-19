const http = require("http");
const { Server } = require("socket.io");

const PORT = 3001;

// Basic HTTP Server for the Webhook
const httpServer = http.createServer((req, res) => {
  // Set CORS headers for the webhook
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/notify") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const { event, data } = JSON.parse(body);
        console.log(`[Socket Server] Broadcast Event: ${event}`, data);
        
        // Broadcast to all connected clients
        io.emit(event, data);
        
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        console.error("Invalid JSON", e);
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Socket.IO Server attached to HTTP Server
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Allow Next.js Client
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`[Socket Server] New Client Connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`[Socket Server] Client Disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`> Socket.IO Server running on http://localhost:${PORT}`);
});
