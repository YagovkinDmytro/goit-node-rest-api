import fs from "node:fs/promises";
import path from "node:path";
import DetectFileEncodingAndLanguage from "detect-file-encoding-and-language";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

const updateContacts = (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export async function getAllContacts() {
  try {
    const { encoding } = await DetectFileEncodingAndLanguage(contactsPath);
    const contactsData = await fs.readFile(contactsPath, encoding);
    const contacts = JSON.parse(contactsData);

    const way = path();
    console.log(way);

    return contacts;
  } catch (error) {
    console.log("\x1B[31m Error parsing JSON:", error);
    throw error;
  }
}

export async function getOneContact(contactId) {
  const contacts = await getAllContacts();
  const result = contacts.find((item) => item.id === contactId);
  return result || null;
}

export async function createContact(data) {
  const contacts = await getAllContacts();

  const newContact = {
    id: nanoid(),
    ...data,
  };

  contacts.push(newContact);

  await updateContacts(contacts);

  return newContact;
}

export async function updateContact(contactId, data) {
  const contacts = await getAllContacts();
  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }

  contacts[index] = { ...movies[index], ...data };

  await updateContacts(contacts);

  return contacts[index];
}

export async function deleteContact(contactId) {
  const contacts = await getAllContacts();

  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }

  const [result] = contacts.splice(index, 1);

  await updateContacts(contacts);

  return result;
}
