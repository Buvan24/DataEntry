const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));
app.use('/api/auth',            require('./routes/auth'));
app.use('/api/members',         require('./routes/members'));
app.use('/api/districts',       require('./routes/districts'));
app.use('/api/unions',          require('./routes/unions'));
app.use('/api/assemblies',      require('./routes/assemblies'));
app.use('/api/areas',           require('./routes/areas'));
app.use('/api/administrations', require('./routes/administrations'));
app.use('/api/positions',       require('./routes/positions'));
app.use('/api/reports',         require('./routes/reports'));
app.get('/', (req, res) => res.json({ message: 'Biography Management System API ✅' }));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
