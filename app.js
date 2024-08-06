const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`App listening at http://localhost:${port}`);
});

