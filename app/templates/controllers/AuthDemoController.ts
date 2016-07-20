import {Controller, Get} from 'giuseppe';

@Controller('secure/ctrl')
class AuthDemoController {
    @Get()
    public getSecure(): string {
        return 'Success.';
    }
}

@Controller('secure/route')
class AuthDemoController {
    @Get()
    public getSecure(): string {
        return 'Success.';
    }
}
