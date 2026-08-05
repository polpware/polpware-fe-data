/**
 * @fileOverview
 * Defines a global dummy records for tables. Each table is configured with a dummy record.
 */
import { legacyLibs } from '@polpware/amd-bridge';

const backbone = legacyLibs.Backbone;

import { IModelLike } from '../interfaces/backbone.interface';

export class DummyRecords {

    private _data: { [key: string]: IModelLike };

    constructor() {
        this._data = {};
    }

    getDummyRecord(key: string) {
        if (!this._data[key]) {
            this._data[key] = new backbone.Model({});
        }
        return this._data[key];
    }
}
