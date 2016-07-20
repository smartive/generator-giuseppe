import {registerControllersFromFolder} from 'giuseppe';
import bodyParser = require('body-parser');
import express = require('express');

const app = express(),
    port = process.env.PORT || 8080;

app.use(bodyParser.json());

registerControllersFromFolder({ folderPath: './build/controllers' }, '/api')
    .then(router => {
        app.use(router);
        app.listen(port, () => {
            console.log(`Api up and running on port: ${port}`);
        });
    })
    .catch(err => console.error('An error happend during the application startup', err));
