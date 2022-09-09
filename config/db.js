const mongoose = require("mongoose");
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB амжилттай холбогдлоо: ${conn.connection.host}`.inverse);
};
module.exports = connectDB;
