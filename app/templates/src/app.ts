import * as bodyparser from 'body-parser';
import { Giuseppe } from 'giuseppe';
<% if(needAuth) { %>
import authentication from './authentication';
<% } %>
const giusi = new Giuseppe();

giusi.expressApp.use(bodyparser.json());
<% if(needAuth) { %>
giusi.expressApp.use(authentication.initialize());
<% } %>
giusi
    .loadControllers('./build/controller/**/*.js')
    .then(() => {
        giusi.start(8080, '', undefined, () => {
            console.log('Giuseppe is up and running on port 8080');
        });
    })
    .catch(e => console.error('An error happend', e));
