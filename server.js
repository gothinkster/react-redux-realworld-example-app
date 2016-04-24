'use strict';

const express = require('express');

const app = express();
app.use(express.static('./bin'));
app.listen(4000);
console.log('listening on port 4000');
