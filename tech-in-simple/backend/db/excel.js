const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '../../database.xlsx');

const initDB = () => {
  if (!fs.existsSync(dbPath)) {
    const wb = xlsx.utils.book_new();
    const usersSheet = xlsx.utils.json_to_sheet([]);
    const topicsSheet = xlsx.utils.json_to_sheet([]);
    xlsx.utils.book_append_sheet(wb, usersSheet, 'Users');
    xlsx.utils.book_append_sheet(wb, topicsSheet, 'Topics');
    xlsx.writeFile(wb, dbPath);
    console.log("Created local Excel Database: database.xlsx");
  }
};

const getSheetData = (sheetName) => {
  initDB(); // Ensure it exists
  const wb = xlsx.readFile(dbPath);
  const sheet = wb.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet) || [];
};

const writeSheetData = (sheetName, data) => {
  const wb = xlsx.readFile(dbPath);
  const newSheet = xlsx.utils.json_to_sheet(data);
  wb.Sheets[sheetName] = newSheet;
  xlsx.writeFile(wb, dbPath);
};

module.exports = {
  getSheetData,
  writeSheetData,
  uuidv4
};
