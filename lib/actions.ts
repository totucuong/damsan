'use server'

import { loadMessages, saveMessages as dbSaveMessages, Message } from "./db";
import { uploadFile as dbUploadFile } from "./storage";


export async function getMessages(userId: string) {
    return loadMessages(userId);
}

export async function saveMessages(messages: Message[], userId: string) {
    return dbSaveMessages(messages, userId);
}

export async function uploadFile(file: File) {
    return dbUploadFile(file);
}