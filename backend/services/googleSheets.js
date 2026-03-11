'use strict';

const { google } = require('googleapis');

/**
 * Authenticate with Google using service account credentials from env
 */
function getAuth() {
  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credentialsJson) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var not set.');

  const credentials = JSON.parse(credentialsJson);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  return auth;
}

/**
 * Format a Date to Pakistan Standard Time (UTC+5)
 * DD/MM/YYYY HH:MM
 */
function formatPST(date) {
  const pst = new Date(date.getTime() + 5 * 60 * 60 * 1000);
  const pad = n => String(n).padStart(2, '0');
  return `${pad(pst.getUTCDate())}/${pad(pst.getUTCMonth() + 1)}/${pst.getUTCFullYear()} ${pad(pst.getUTCHours())}:${pad(pst.getUTCMinutes())}`;
}

/**
 * Append one order row to the "Orders" sheet
 * Row format: | Order ID | Date & Time | Item Names | Qty Each | Total Price | Status |
 */
async function appendOrderToSheet(order) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error('GOOGLE_SHEET_ID env var not set.');

  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  const itemNames = order.items.map(i => i.name).join(', ');
  const qtyEach   = order.items.map(i => `${i.name}×${i.qty}`).join(', ');

  const row = [
    order.orderId,
    formatPST(new Date(order.createdAt)),
    itemNames,
    qtyEach,
    `Rs ${order.total.toLocaleString('en-PK')}`,
    order.status
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range:         'Orders!A:F',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] }
  });

  console.log(`[GoogleSheets] Appended order ${order.orderId} to sheet.`);
}

module.exports = { appendOrderToSheet };
