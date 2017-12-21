/**
 * @fileOverview
 * Defines the user credential. This user credential supports event
 * listening. Note that the credential is assumed to be Uppercase:
 * Username and Password
 */
import * as dependencies from 'principleware-fe-dependencies';

import {
    isArray
} from 'principleware-fe-utilities/src/typing/type-checker';


import { observableDecorator } from '../decorators/observable.decorator';
import { IObservable } from '../interfaces/observable.interface';
import { IEventArgs } from '../interfaces/event-args.interface';

import { PolicyBase } from './policy-base';

const _ = dependencies.underscore;

function isEquiva(a: any, b: any): boolean {

    // Strict equals
    if (a === b) {
        return true;
    }

    // Compare null
    if (a === null || b === null) {
        return a === b;
    }

    // Compare number, boolean, string, undefined
    if (typeof a !== "object" || typeof b !== "object") {
        return a === b;
    }

    // Compare arrays
    if (isArray(b) && isArray(a)) {
        if (a.length !== b.length) {
            return false;
        }

        let k = a.length;
        while (k--) {
            if (!isEquiva(a[k], b[k])) {
                return false;
            }
        }
    }

    const checked = {};
    for (const k in b) {
        if (!isEquiva(a[k], b[k])) {
            return false;
        }

        checked[k] = true;
    }

    for (const k in a) {
        if (!checked[k] && !isEquiva(a[k], b[k])) {
            return false;
        }
    }

    return true;
}

export interface IUserProfile {
    username?: string;
    email?: string;
    role?: string;
    dispayName?: string;
}

// immutable 

@observableDecorator
export class UserCredential {

    private _user: IUserProfile;
    /**
     * @constructor Credential
     */
    constructor(public authPolicy: PolicyBase) {
        this._user = {};
    }

    public get asObservable(): IObservable {
        const self: any = this;
        return self as IObservable;
    }


    // Does not trigger any event
    readFrom(data: IUserProfile): void {
        this._user = _.extend(this._user, data);
    }

    setUser(data: IUserProfile): void {
        if (isEquiva(this._user, data)) {
            return;
        }

        this._user = data;
        const evt = {
            user: data
        };
        this.asObservable.fire('change:user', evt);
    }

    extendUser(data: IUserProfile): void {
        const newData = _.extend({}, this._user, data);
        this.setUser(newData);
    }

    getUser(): IUserProfile {
        return _.extend({}, this._user);
    }

    subscribe(handler: (evt: IEventArgs) => IEventArgs) {
        this.asObservable.on('change:user', handler);
    }

    unSubscribe(handler: (evt: IEventArgs) => IEventArgs) {
        this.asObservable.off('change:user', handler);
    }

    isUserKnown(): boolean {
        return !!(this._user && this._user.username);
    }

    isAuthenticated(): boolean {
        return this.authPolicy && !this.authPolicy.isExpired();
    }
}
