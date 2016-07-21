import {Controller, Get} from 'giuseppe';
import passport from '../Authentication';

@Controller('secure/ctrl', passport.authenticate('basic', { session: false }))
class ControllerAuth {
    @Get()
    public getSecure(): string {
        return 'Success.';
    }
}

@Controller('secure/route')
class RouteAuth {
    @Get('', passport.authenticate('basic', { session: false }))
    public getSecure(): string {
        return 'Success.';
    }
}
