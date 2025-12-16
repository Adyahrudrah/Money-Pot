export interface SmsMessage {
  _id: number;
  address: string;
  block_type: number;
  body: string;
  creator: string;
  date: number;
  date_sent: number;
  deleted: number;
  error_code: number;
  favourite: number;
  locked: number;
  oplus_collected: number;
  oplus_drafts: number;
  oplus_mass: number;
  oplus_service_message_sms_type: number;
  oplus_sms_type: number;
  oplus_timer: number;
  phone_id: number;
  priority: number;
  rcs_audio_read: number;
  rcs_burn: number;
  rcs_chat_type: number;
  rcs_file_size: number;
  rcs_is_download: number;
  rcs_media_played: number;
  rcs_msg_type: number;
  read: number;
  seen: number;
  status: number;
  sub_id: number;
  sync_state: number;
  thread_id: number;
  type: number;
  account_id?: string;
}

export type AccountType =
  | "credit-card"
  | "debit-card"
  | "digital-wallet"
  | "cash";

export interface AccountTypeList {
  name: string;
  value: AccountType;
}

export const AccountTypes: AccountTypeList[] = [
  { name: "Credit Card", value: "credit-card" },
  { name: "Debit Card", value: "debit-card" },
  { name: "Digital Wallet", value: "digital-wallet" },
  { name: "Cash", value: "cash" },
];

export interface Account {
  id: string;
  account_name: string;
  account_type: AccountTypeList;
  balance: number;
  currency_type: Currency;
  added_date: number;
  parent_account_id: string | null;
  transactions: Transaction[];
  limit?: number | null;
}

export interface Transaction {
  message_body: string;
  id: number;
  date: number;
  amount: number;
  type: "credit" | "debit";
  name?: string;
  counter_party?: string;
  category?: string;
  notes?: string;
  tags?: string[];
  account_id?: string;
}

export const debit_categories = [
  "Food", // Groceries, Dining Out, Coffee
  "Travel", // Transport, Flights, Vacation
  "Housing", // Rent/Mortgage, Maintenance
  "Utilities", // Electricity, Water, Internet, Phone
  "Transportation", // Gas/Fuel, Public Transit, Car Maintenance
  "Shopping", // Clothes, Electronics, Household Items
  "Entertainment", // Movies, Streaming, Hobbies, Events
  "Health", // Medical, Pharmacy, Gym/Fitness
  "Insurance", // Health, Car, Home/Renters
  "Education", // Tuition, Books, Courses
  "Personal Care", // Beauty, Haircut, Grooming
  "Subscriptions", // Netflix, Spotify, Apps
  "Bills & Fees", // Bank Fees, Late Fees
  "Debt Payments", // Loans, Credit Card Minimums
  "Gifts & Donations", // Charity, Birthdays, Holidays
  "Pets", // Food, Vet, Supplies
  "Kids & Family", // Childcare, Toys, Activities
  "Miscellaneous", // Catch-all for uncategorized
];

export const credit_categories = [
  "Salary", // Main Job Paycheck
  "Investment", // Dividends, Interest, Stock Gains
  "Freelance", // Side Gigs, Consulting
  "Business", // Self-Employment, Sales
  "Bonus", // Work Bonus, Performance
  "Gifts", // Birthday, Holiday Money
  "Refunds", // Returns, Reimbursements
  "Rental Income", // Property Rent
  "Pension", // Retirement Payments
  "Benefits", // Unemployment, Government Aid
  "Miscellaneous", // Miscellaneous Inflows
];

export interface Currency {
  sign: string;
  name: string; // ISO 4217 code for uniqueness and standards
  country: string; // Primary country/region (some are shared)
}

export const currencies: Currency[] = [
  { sign: "$", name: "USD", country: "United States" },
  { sign: "€", name: "EUR", country: "Eurozone (EU)" },
  { sign: "£", name: "GBP", country: "United Kingdom" },
  { sign: "¥", name: "JPY", country: "Japan" },
  { sign: "¥", name: "CNY", country: "China" },
  { sign: "A$", name: "AUD", country: "Australia" },
  { sign: "C$", name: "CAD", country: "Canada" },
  { sign: "CHF", name: "CHF", country: "Switzerland" },
  { sign: "₹", name: "INR", country: "India" },
  { sign: "R$", name: "BRL", country: "Brazil" },
  { sign: "₽", name: "RUB", country: "Russia" },
  { sign: "kr", name: "SEK", country: "Sweden" },
  { sign: "kr", name: "NOK", country: "Norway" },
  { sign: "kr", name: "DKK", country: "Denmark" },
  { sign: "NZ$", name: "NZD", country: "New Zealand" },
  { sign: "Mex$", name: "MXN", country: "Mexico" },
  { sign: "S$", name: "SGD", country: "Singapore" },
  { sign: "HK$", name: "HKD", country: "Hong Kong" },
  { sign: "₩", name: "KRW", country: "South Korea" },
  { sign: "₺", name: "TRY", country: "Turkey" },
  { sign: "R", name: "ZAR", country: "South Africa" },
  { sign: "₪", name: "ILS", country: "Israel" },
  { sign: "zł", name: "PLN", country: "Poland" },
  { sign: "฿", name: "THB", country: "Thailand" },
  { sign: "Rp", name: "IDR", country: "Indonesia" },
  { sign: "Ft", name: "HUF", country: "Hungary" },
  { sign: "Kč", name: "CZK", country: "Czech Republic" },
  { sign: "₱", name: "PHP", country: "Philippines" },
  { sign: "RM", name: "MYR", country: "Malaysia" },
  { sign: "د.إ", name: "AED", country: "United Arab Emirates" },
  { sign: "₴", name: "UAH", country: "Ukraine" },
  { sign: "lei", name: "RON", country: "Romania" },
  { sign: "kn", name: "HRK", country: "Croatia" },
  { sign: "₫", name: "VND", country: "Vietnam" },
  { sign: "₡", name: "CRC", country: "Costa Rica" },
  { sign: "ل.س", name: "SYP", country: "Syria" },
  { sign: "₲", name: "PYG", country: "Paraguay" },
  { sign: "Bs", name: "VEF", country: "Venezuela" },
  { sign: "₦", name: "NGN", country: "Nigeria" },
  { sign: "E£", name: "EGP", country: "Egypt" },
  { sign: "₨", name: "PKR", country: "Pakistan" },
  { sign: "₨", name: "NPR", country: "Nepal" },
  { sign: "₽", name: "BYR", country: "Belarus" },
  { sign: "₼", name: "AZN", country: "Azerbaijan" },
  { sign: "лв", name: "BGN", country: "Bulgaria" },
  { sign: "د.ب", name: "BHD", country: "Bahrain" },
  { sign: "ر.ع", name: "OMR", country: "Oman" },
  { sign: "د.ك", name: "KWD", country: "Kuwait" },
  { sign: "QR", name: "QAR", country: "Qatar" },
  { sign: "ر.س", name: "SAR", country: "Saudi Arabia" },
];
