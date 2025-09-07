'use server'

import { loadMessages } from "./db";

export async function getMessages(userId: string) {
    return loadMessages(userId);
}