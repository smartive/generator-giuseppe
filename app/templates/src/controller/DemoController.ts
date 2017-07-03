import { Request, Response } from 'express';
import { Body, Controller, Delete, ErrorHandler, Get, Post, Put, UrlParam } from 'giuseppe';
<% if(needAuth) { %>
import authentication from './authentication';
<% } %>
export class DemoNotFound extends Error {
    constructor(id: number) {
        super(`Demo object with id "${id}" was not found.`);
    }
}

export class Demo {
    public id: number;

    constructor(value: any) {
        this.id = value.id;
    }
}

@Controller('demo')
export class DemoController {
    private demos: Demo[] = [];

    @Get()
    public getDemos(): Demo[] {
        return this.demos;
    }

    @Get(':id')
    public getDemo(@UrlParam('id') id: number): Demo {
        const filtered = this.demos.filter(d => d.id === id);
        if (!filtered.length) {
            throw new Error('not found.');
        }

        return filtered[0];
    }

    @Put()
    public createDemo(@Body({ required: true }) body: Demo): void {
        this.demos.push(body);
    }

    @Post(':id')
    public updateDemo(@UrlParam('id') id: number, @Body({ required: true }) body: Demo): void {
        const filtered = this.demos.filter(d => d.id === id);
        if (!filtered.length) {
            throw new DemoNotFound(id);
        }
        this.demos.splice(this.demos.indexOf(filtered[0]), 1, body);
    }

    @Delete(':id' <% if(needAuth) { %>, authentication.authenticate('bearer', { session: false }) <% } %>)
    public deleteDemo(@UrlParam('id') id: number): void {
        const filtered = this.demos.filter(d => d.id === id);
        if (!filtered.length) {
            throw new DemoNotFound(id);
        }
        this.demos.splice(this.demos.indexOf(filtered[0]), 1);
    }

    @ErrorHandler(DemoNotFound)
    public notFound(_req: Request, res: Response, _err: DemoNotFound): void {
        res.status(404).end();
    }

    @ErrorHandler()
    public internalServerError(_req: Request, res: Response, err: Error): void {
        console.error(err);
        res.status(500).json({ err }).end();
    }
}

@Controller()
export class CatchAllController {
    @Get('/*')
    public catchAll(): any {
        return {
            msg: 'This webapp is powered by giuseppe. http://github.com/smartive/giuseppe',
        };
    }
}
