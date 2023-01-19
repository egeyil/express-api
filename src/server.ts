import app from "./app";
import connectDB from "./utils/dbConnect";
import swaggerDocs from "./utils/swagger";
import config from "./config/config";

const PORT = Number(config.port);

async function startServer () {
  await connectDB();
  swaggerDocs(app, PORT);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();