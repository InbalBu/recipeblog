const mongoose = require('mongoose');

try {
    mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log('MongoDB is Connected...');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
    console.log('connected')
}); 

// Models

require('./Category');
require('./Recipe');

