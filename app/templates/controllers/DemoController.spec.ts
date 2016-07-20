import {DemoController} from './DemoController';
import chai = require('chai');

chai.should();

describe('DemoController', () => {

    let controller: DemoController;

    beforeEach(() => {
        controller = new DemoController();
    });

    it('should get empty array', () => {
        controller.getDemos().should.be.an('array').with.lengthOf(0);
    });

    it('should throw on not found demo', () => {
        let fn = () => {
            controller.getDemo(1);
        };

        fn.should.throw;
    });

});
