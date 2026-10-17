/**
 * ==============================================================================
 * 🏫 [우리 반 활동 타이머] Google Apps Script 연동 코드 (Code.gs)
 * ==============================================================================
 * 
 * 1. 목적:
 *    - 구글 스프레드시트에 활동 타이머 설정 및 완료 기록을 안전하게 저장하고 불러옵니다.
 *    - 학생 개인정보는 일체 수집하거나 저장하지 않습니다.
 * 
 * 2. 시트 스키마(열 구성):
 *    A열: 타이머 (활동 이름)
 *    B열: 시간 (전체 초)
 *    C열: 분
 *    D열: 초
 *    E열: 남은 시간
 *    F열: 기록 일시
 * 
 * 3. 보안 및 접근 권한 설정:
 *    - 배포 유형: 웹 앱 (Web App)
 *    - 다음 사용자 권한으로 실행: '나(내 계정, Me)'
 *    - 액세스 권한: '모든 사용자(Anyone)' (로그인 팝업 없이 웹앱에서 접근 가능)
 *    - 무제한 공개 쓰기를 방지하기 위해 입력값(활동명 길이, 분·초 범위)을 엄격히 검증합니다.
 * ==============================================================================
 */

// 시트 탭 이름 상수
var SHEET_NAME = "타이머기록";

/**
 * 1. 초기 시트 준비 함수 (선택 사항 - 메뉴에서 직접 실행 가능)
 * 시트가 없으면 만들고 헤더를 세팅합니다.
 */
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["타이머", "시간", "분", "초", "남은 시간", "기록 일시"]);
    // 헤더 스타일 서식
    var headerRange = sheet.getRange("A1:F1");
    headerRange.setBackground("#2563eb")
               .setFontColor("#ffffff")
               .setFontWeight("bold")
               .setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
}

/**
 * 2. GET 요청 처리 (데이터 읽기)
 * 최근 설정한 활동 이름 및 시간 설정을 불러옵니다.
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    
    var records = [];
    if (sheet && sheet.getLastRow() > 1) {
      // 최근 20개의 기록 조회
      var startRow = Math.max(2, sheet.getLastRow() - 19);
      var numRows = sheet.getLastRow() - startRow + 1;
      var data = sheet.getRange(startRow, 1, numRows, 6).getValues();
      
      for (var i = 0; i < data.length; i++) {
        var row = data[i];
        records.push({
          activity: String(row[0]),
          totalSeconds: Number(row[1]),
          minutes: Number(row[2]),
          seconds: Number(row[3]),
          remaining: String(row[4]),
          timestamp: String(row[5])
        });
      }
    }
    
    var responseData = {
      status: "success",
      count: records.length,
      data: records
    };
    
    // JSONP 지원 (CORS 제약 원천 우회)
    var callback = e && e.parameter && e.parameter.callback;
    if (callback) {
      return ContentService.createTextOutput(callback + "(" + JSON.stringify(responseData) + ")")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService.createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    var errObj = { status: "error", message: error.toString() };
    return ContentService.createTextOutput(JSON.stringify(errObj))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 3. POST 요청 처리 (타이머 활동 기록 추가)
 * 검증 규칙:
 * - activity: 1자 이상 50자 이하 문자열
 * - minutes: 0 이상 999 이하 정수
 * - seconds: 0 이상 59 이하 정수
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("전송된 데이터가 없습니다.");
    }
    
    var payload = JSON.parse(e.postData.contents);
    
    // 입력값 검증 (보안 방어)
    var activity = String(payload.activity || "").trim();
    if (!activity) {
      activity = "우리 반 활동";
    }
    if (activity.length > 50) {
      activity = activity.substring(0, 50);
    }
    
    var minutes = parseInt(payload.minutes, 10);
    var seconds = parseInt(payload.seconds, 10);
    
    if (isNaN(minutes) || minutes < 0 || minutes > 999) {
      throw new Error("분의 범위가 올바르지 않습니다 (0~999).");
    }
    if (isNaN(seconds) || seconds < 0 || seconds >= 60) {
      throw new Error("초의 범위가 올바르지 않습니다 (0~59).");
    }
    
    var totalSeconds = (minutes * 60) + seconds;
    var remaining = String(payload.remaining || "00:00");
    var nowString = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
    
    // 시트 확인 및 저장
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      setupSheet();
      sheet = ss.getSheetByName(SHEET_NAME);
    }
    
    // 행 추가 (스키마: 타이머, 시간, 분, 초, 남은 시간, 기록 일시)
    sheet.appendRow([activity, totalSeconds, minutes, seconds, remaining, nowString]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "활동 타이머가 스프레드시트에 안전하게 기록되었습니다.",
      recordedAt: nowString
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
