import type { Contact } from "@types/contact";
import { investorContacts } from "./investor-contacts";
import { clientContacts } from "./client-contacts";
import { otherContacts } from "./other-contacts";

/**
 * Mock CRM Contacts
 *
 * 38 contacts organized into three categories:
 * - Investors (12): VCs, angels, board members
 * - Clients (14): Enterprise customers, prospects
 * - Other (12): Advisors, partners, industry contacts
 */
export const mockContacts: Contact[] = [
  ...investorContacts,
  ...clientContacts,
  ...otherContacts,
];
