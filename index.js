const express = require('express');
const app = express();
const cors = require('cors')
const port = 3000;
const appRoutes = require('./routes/routes')

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

app.use('/',appRoutes)


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
