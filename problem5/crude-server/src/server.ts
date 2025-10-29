import app, { startServer } from "./app";

const PORT = process.env.PORT || 5000;

// initialize database then start server
startServer().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
  });
});
