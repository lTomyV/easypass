"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
// src/core/domain/Event.ts
class Event {
    constructor(id, title, date, description, quota) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.description = description;
        this.quota = quota;
    }
}
exports.Event = Event;
