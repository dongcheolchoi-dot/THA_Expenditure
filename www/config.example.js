// 로컬 테스트 시 이 파일을 www/config.js 로 복사해 사용하세요.
// GitHub Actions 빌드 시에는 Secrets 값으로 www/config.js 가 자동 생성됩니다.
window.APP_CONFIG = {
  SCRIPT_URL: "",   // 예: "https://script.google.com/macros/s/XXXX/exec"
  DEFAULT_PIN: "",  // 방식 B 사용 시에만 자동 주입됨
  AUTH_MODE: "A"    // "A": 최초 1회 PIN 입력 후 자동 로그인 (추천), "B": 무입력 자동 로그인
};
