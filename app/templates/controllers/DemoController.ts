import {Controller, Get, Put, Post, Delete, ErrorHandler, UrlParam, Body, RouteError} from 'giuseppe';
import {Request, Response} from 'express';

class DemoNotFound extends RouteError {
    constructor(id: number) {
        super();
        this.message = `Demo object with id "${id}" was not found.`;
    }
}

class Demo {
    public id: number;

    constructor(value: any) {
        this.id = value.id;
    }
}

@Controller()
class DemoController {
    private demos: Demo[] = [];

    @Get()
    public getDemos(): Demo[] {
        return this.demos;
    }

    @Get(':id')
    public getDemo( @UrlParam('id') id: number): Demo {
        let filtered = this.demos.filter(d => d.id === id);
        if (!filtered.length) {
            throw new Error('not found.');
        }

        return filtered[0];
    }

    @Put()
    public createDemo( @Body({ required: true }) body: Demo): void {
        this.demos.push(body);
    }

    @Post(':id')
    public updateDemo( @UrlParam('id') id: number, @Body({ required: true }) body: Demo): void {
        let filtered = this.demos.filter(d => d.id === id);
        if (!filtered.length) {
            throw new DemoNotFound(id);
        }
        this.demos.splice(this.demos.indexOf(filtered[0]), 1, body);
    }

    @Delete(':id')
    public deleteDemo( @UrlParam('id') id: number): void {
        let filtered = this.demos.filter(d => d.id === id);
        if (!filtered.length) {
            throw new DemoNotFound(id);
        }
        this.demos.splice(this.demos.indexOf(filtered[0]), 1);
    }

    @ErrorHandler(DemoNotFound)
    public notFound(req: Request, res: Response, err: DemoNotFound): void {
        res.status(404).end();
    }
    
    @ErrorHandler()
    public internalServerError(req: Request, res: Response, err: Error): void {
        console.error(err);
        res.status(500).json({ err }).end();
    }

    @Get('~/*')    
    public catchAll(): any {
        return {
            msg: 'This webapp is powered by giuseppe. http://github.com/smartive/giuseppe'
        };
    }
}
