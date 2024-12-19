"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Provider {
    constructor(name, baseUrl) {
        this.name = "";
        this.baseUrl = "";
        this.name = name;
        this.baseUrl = baseUrl;
    }
    getName() {
        return this.name;
    }
    getBaseUrl() {
        return this.baseUrl;
    }
    setBaseUrl(baseUrl) {
        this.baseUrl = baseUrl;
    }
}
exports.default = Provider;
