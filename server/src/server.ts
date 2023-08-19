import app from './index';
import connectDB from './models/_index';

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`🚀 Live from Berlin at port ${PORT}, its Project Lent. 🚀`);
  await connectDB();
  console.log(`💿 Database connected. 💿`)
});