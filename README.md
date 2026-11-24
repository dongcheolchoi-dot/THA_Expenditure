# 태국 간편 가계부 APK 프로젝트 (Google Sheets DB + GitHub Actions)

구글 시트를 무료 데이터베이스(DB)로 사용하고, GitHub Actions를 통해 안드로이드 APK를 자동 빌드하는 프로젝트입니다.

## 폴더 구조
- `www/index.html` : 태국어/한국어 가계부 웹 앱 (PIN 자동 로그인 + 구글 시트 연동)
- `www/config.example.js` : 로컬 테스트용 설정 예시
- `apps-script/Code.gs` : 구글 시트에 붙여넣을 Google Apps Script 백엔드 코드
- `.github/workflows/build-apk.yml` : GitHub Actions 자동 APK 빌드 설정
- `package.json`, `capacitor.config.json` : Capacitor 안드로이드 패키징 설정

---

## 1단계: Google Sheets & Apps Script 설정
1. 새 Google Sheets를 만들고 상단 **[확장 프로그램] → [Apps Script]**를 엽니다.
2. `apps-script/Code.gs` 파일 내용을 붙여넣고, 상단의 `SECRET_PIN = "1234"`를 원하는 번호로 변경합니다.
3. **[배포] → [새 배포] → [웹 앱]** 선택:
   - 다음 사용자 권한으로 실행: **나**
   - 액세스 권한이 있는 사용자: **모든 사용자**
4. 발급된 **웹 앱 URL**(`https://script.google.com/macros/s/.../exec`)을 복사합니다.

---

## 2단계: GitHub 업로드 및 Secrets 등록
1. 새 GitHub 저장소를 만들고 이 압축 파일 안의 모든 파일(숨김 폴더 `.github` 포함)을 업로드합니다.
2. 저장소 **[Settings] → [Secrets and variables] → [Actions] → [New repository secret]**에서 아래 값을 등록합니다.
   - `SCRIPT_URL` : 1단계에서 복사한 Apps Script 웹 앱 URL (필수)
   - `AUTH_MODE` : `A` (최초 1회 PIN 입력 후 자동 로그인 — 추천) 또는 `B` (완전 무입력 자동 로그인)
   - `APP_PIN` : `AUTH_MODE`가 `B`일 때만 필수 (Apps Script의 `SECRET_PIN`과 동일하게 입력)

---

## 3단계: APK 자동 빌드 및 다운로드
1. 코드를 `main` 브랜치에 푸시하거나, GitHub 상단 **[Actions] → [Build Android APK] → [Run workflow]**를 클릭합니다.
2. 약 2~3분 후 빌드가 완료되면 작업 하단의 **Artifacts → `thai-ledger-apk`**를 클릭해 `.apk` 파일을 다운로드합니다.
3. 안드로이드 스마트폰으로 옮겨 설치합니다.
