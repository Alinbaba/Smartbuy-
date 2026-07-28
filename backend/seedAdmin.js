require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const exists = await User.findOne({ role: 'main-admin' });
    if(!exists) {
      await User.create({ name: 'Main Admin', email: 'admin@site.com', password: 'Admin123!', role: 'main-admin' });
      console.log('Main admin created.');
    } else {
      console.log('Main admin already exists.');
    }
    process.exit();
  })
  .catch(err => console.error(err));