import {registerControllersFromFolder} from 'giuseppe';
import bodyParser = require('body-parser');
import express = require('express');
<% if (needAuth) { -%>
import passport from './Authentication';
<% } -%>

const app = express(),
    port = process.env.PORT || 8080;

app.use(bodyParser.json());
<% if (needAuth) { -%>
app.use(passport.initialize());
<% } -%>

registerControllersFromFolder({ folderPath: './build/controllers', matchRegExp: /^((?!spec).)*[.]js$/ }, '/api')
    .then(router => {
        app.use(router);
        app.listen(port, () => {
            console.log(`Api up and running on port: ${port}`);
        });
    })
    .catch(err => console.error('An error happend during the application startup', err));
