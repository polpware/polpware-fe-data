import tools from '@polpware/tinymce-tailor/api/util/Tools';
import EventDispatcher from '@polpware/tinymce-tailor/api/util/EventDispatcher';

import { Test } from './test-class.spec';

import { IObservable } from '../interfaces/observable.interface';

describe('event dispather', () => {
    it('loaded', () => {
        const m = new EventDispatcher();
        expect(m).toBeDefined();
    });
});

describe('tools', () => {
    it('loaded', () => {
        expect(tools).toBeDefined();
    });
});

describe('observableDecorator', () => {

    const t = new Test();
    const y: any = t;

    const z: IObservable = y;

    it('ctor', () => {
        expect(t).toBeDefined();
    });

    it('observable', () => {
        expect(z.fire).toBeDefined();
    });

    it('hasEventListener', () => {
        expect(z.hasEventListeners('hello')).toBe(false);
    });
});
