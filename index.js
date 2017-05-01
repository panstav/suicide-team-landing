const express = require('express');
const compression = require('compression');

const isProduction = process.env.NODE_ENV === 'production';

const server = express();

// Heroku fix
if (process.env.HEROKU) server.enable('trust proxy');

// compression for production environment
server.use(compression());

server.get('/', (req, res) => res.sendFile('index.html', { root: 'public' }));

// redirect any path with '.html' suffix to homepage
server.get(/\.html/, (req, res) => res.redirect(308, '/'));

// serve static files
server.use(express.static('public', { maxAge: isProduction ? 1000*60*60*24*365 : 0 }));

const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`Listening on ${port}`);
});