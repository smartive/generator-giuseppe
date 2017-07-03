import { DemoController } from '../../src/controller/DemoController';

describe('DemoController', () => {

    it('should return an empty array', () => {
        const ctrl = new DemoController();
        expect(ctrl.getDemos()).toHaveLength(0);
    });

});
