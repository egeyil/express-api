import app from "./app";
import connectDB from "./utils/dbConnect";
import swaggerDocs from "./utils/swagger";

const PORT = Number(process.env.PORT) || 3500;

async function startServer () {
  await connectDB();
  swaggerDocs(app, PORT);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();