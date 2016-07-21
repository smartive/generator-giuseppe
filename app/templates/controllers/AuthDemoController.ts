import {Controller, Get} from 'giuseppe';
import passport from '../Authentication';
<% if (basic) { -%>

@Controller('secure/basic/ctrl', passport.authenticate('basic', { session: false }))
class BasicControllerAuth {
    @Get()
    public getSecure(): string {
        return 'Success.';
    }
}

@Controller('secure/basic/route')
class BasicRouteAuth {
    @Get('', passport.authenticate('basic', { session: false }))
    public getSecure(): string {
        return 'Success.';
    }
}
<% } -%>
<% if (bearer) { -%>

@Controller('secure/bearer/ctrl', passport.authenticate('bearer', { session: false }))
class BearerControllerAuth {
    @Get()
    public getSecure(): string {
        return 'Success.';
    }
}

@Controller('secure/bearer/route')
class BearerRouteAuth {
    @Get('', passport.authenticate('bearer', { session: false }))
    public getSecure(): string {
        return 'Success.';
    }
}
<% } -%>
<% if (local) { -%>

@Controller('secure/local/ctrl', passport.authenticate('local', { session: false }))
class LocalControllerAuth {
    @Get()
    public getSecure(): string {
        return 'Success.';
    }
}

@Controller('secure/local/route')
class LocalRouteAuth {
    @Get('', passport.authenticate('local', { session: false }))
    public getSecure(): string {
        return 'Success.';
    }
}
<% } -%>
