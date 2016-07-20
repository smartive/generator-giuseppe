import {Controller, Get} from 'giuseppe';

@Controller('secure/ctrl')
class ControllerAuth {
    @Get()
    public getSecure(): string {
        return 'Success.';
    }
}

@Controller('secure/route')
class RouteAuth {
    @Get()
    public getSecure(): string {
        return 'Success.';
    }
}
