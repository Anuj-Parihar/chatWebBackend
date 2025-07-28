// const mongoose = require('mongoose');
// const { server } = require('./app');
// const config = require('./config/config');

// const PORT = process.env.PORT || 5000;

// mongoose.connect(config.mongodbUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// //   useCreateIndex: true,
// //   useFindAndModify: false
// })
// .then(() => {
//   console.log('Connected to MongoDB');
//   server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// })
// .catch(err => {
//   console.error('MongoDB connection error:', err);
//   process.exit(1);
// });


const mongoose = require('mongoose');
const { server } = require('./app');
const config = require('./config/config');

const PORT = config.port;

mongoose.connect(config.mongodbUri)
  .then(() => {
    console.log(' Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(' MongoDB connection error:', err);
    process.exit(1);
  });
