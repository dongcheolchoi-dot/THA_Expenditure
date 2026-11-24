/**
 * Thai Ledger - Google Sheets Backend (Google Apps Script)
 * 1행 헤더: id | date | type | category | amount | memo | createdAt
 */

const SECRET_PIN = "1234"; // 본인이 사용할 PIN 번호로 변경하세요.

function getSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["id", "date", "type", "category", "amount", "memo", "createdAt"]);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// 1. 데이터 불러오기 & PIN 검증 (GET)
function doGet(e) {
  const pin = e && e.parameter ? String(e.parameter.pin || "") : "";
  if (pin !== SECRET_PIN) {
    return jsonResponse({ status: "error", message: "Invalid PIN" });
  }

  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  const data = [];

  for (let i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    data.push({
      id: String(rows[i][0]),
      date: rows[i][1] instanceof Date
        ? Utilities.formatDate(rows[i][1], Session.getScriptTimeZone(), "yyyy-MM-dd")
        : String(rows[i][1]),
      type: String(rows[i][2]),
      category: String(rows[i][3]),
      amount: Number(rows[i][4]),
      memo: String(rows[i][5] || ""),
      createdAt: String(rows[i][6] || "")
    });
  }

  const props = PropertiesService.getScriptProperties();
  const budget = Number(props.getProperty("MONTHLY_BUDGET") || 15000);

  return jsonResponse({
    status: "ok",
    data: data,
    budget: budget
  });
}

// 2. 데이터 추가 / 삭제 / 초기화 / 예산 저장 (POST)
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    if (String(payload.pin || "") !== SECRET_PIN) {
      return jsonResponse({ status: "error", message: "Invalid PIN" });
    }

    const sheet = getSheet();
    const action = payload.action;

    if (action === "add") {
      const item = payload.item;
      sheet.appendRow([
        String(item.id),
        String(item.date),
        String(item.type),
        String(item.category),
        Number(item.amount),
        String(item.memo || ""),
        new Date().toISOString()
      ]);
      return jsonResponse({ status: "ok" });
    }

    if (action === "delete") {
      const targetId = String(payload.id);
      const rows = sheet.getDataRange().getValues();
      for (let i = rows.length - 1; i >= 1; i--) {
        if (String(rows[i][0]) === targetId) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      return jsonResponse({ status: "ok" });
    }

    if (action === "clear") {
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.deleteRows(2, lastRow - 1);
      }
      return jsonResponse({ status: "ok" });
    }

    if (action === "setBudget") {
      const budget = Number(payload.budget || 15000);
      PropertiesService.getScriptProperties().setProperty("MONTHLY_BUDGET", String(budget));
      return jsonResponse({ status: "ok", budget: budget });
    }

    return jsonResponse({ status: "error", message: "Unknown action" });
  } catch (err) {
    return jsonResponse({ status: "error", message: String(err) });
  }
}
