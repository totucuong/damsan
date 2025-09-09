'use server'

import { loadMessages, saveMessages as dbSaveMessages, Message } from "./db";

export async function getMessages(userId: string) {
    return loadMessages(userId);
}

export async function saveMessages(messages: Message[], userId: string) {
    return dbSaveMessages(messages, userId);
}