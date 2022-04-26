import { factory } from './factory';

describe('ngx store ctor', () => {

    const p = factory();
    it('state is defined', () => expect(p).toBeDefined());

    const q = p.select('collection');
    it('collection is defined', () => expect(q).toBeDefined());
});

describe('ngx store add', () => {

    const p = factory();
    const q = p.select('collection');

    it('add', (done) => {
        let subscribeId = null;
        subscribeId = q.subscribe(m => {
            if (m.items.length < 1) {
                return;
            }
            expect(m.items.length).toBe(1);

            subscribeId && subscribeId.unsubscribe();

            done();
        });
        p.dispatch({
            type: 'ADD',
            payload: [{
                name: 'hello',
                id: '111'
            }]
        });

    });

});


describe('ngx store remove', () => {

    const p = factory();
    const q = p.select('collection');

    p.dispatch({
        type: 'ADD',
        payload: [{
            name: 'hello',
            id: '111'
        }]
    });


    it('remove ...', (done) => {
        let subscribeId = null;
        subscribeId = q.subscribe(m => {
            if (m.items.length > 0) {
                return;
            }
            expect(m.items.length).toBe(0);

            subscribeId && subscribeId.unsubscribe();
            done();
        });
        p.dispatch({
            type: 'REMOVE',
            payload: [{
                name: 'hello',
                id: '111'
            }]
        });

    });

});


describe('ngx store isolation', () => {

    const pp = factory();
    const qq = pp.select('collection');

    const p = factory();
    const q = p.select('collection');

    it('not equal', () => {
        expect(qq === q).toBeFalsy();
    });

    p.dispatch({
        type: 'ADD',
        payload: [{
            name: 'hello',
            id: '111'
        }]
    });


    it('Add to b but check a', (done) => {
        let subscribeId = null;
        subscribeId = qq.subscribe(m => {
            expect(m.items.length).toBe(0);

            subscribeId && subscribeId.unsubscribe();

            done();
        });

        p.dispatch({
            type: 'ADD',
            payload: [{
                name: 'hello',
                id: '114'
            }]
        });

    });

});


