const USER_ACCOUNTS_LS = "@user_accounts";
const CURRENCY_TYPE_LS = "@currency_type";
const MESSAGES_LS = "@messages";
const AMOUNT_REGEX = /Rs\.?\s?([\d.,]+)/g;
const COUNTER_PARTY_REGEX = /((At\s[^@]+@[^\s]+)|(debit|sent|deduct))/gi;
const FILTER_KEYS_REGEX = /\b(due|mandate)\b/gi;

interface Keys {
  USER_ACCOUNTS_LS: string;
  CURRENCY_TYPE_LS: string;
  MESSAGES_LS: string;
  AMOUNT_REGEX: RegExp;
  COUNTER_PARTY_REGEX: RegExp;
  FILTER_KEYS_REGEX: RegExp;
}

const KEYS: Keys = {
  USER_ACCOUNTS_LS,
  CURRENCY_TYPE_LS,
  MESSAGES_LS,
  AMOUNT_REGEX,
  COUNTER_PARTY_REGEX,
  FILTER_KEYS_REGEX,
};

export default KEYS;
