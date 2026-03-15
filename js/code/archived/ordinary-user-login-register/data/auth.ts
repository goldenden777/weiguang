
export interface RegisterResponse {
  success: boolean;
  message: string;
  nextStep: string;
}

export const SMS_CONFIG = {
  countdownSeconds: 60,
  mockCode: "123456",
  termsLink: "./terms.html",
  privacyLink: "./privacy.html"
};

export const REGISTER_UI_TEXT = {
  title: "手机号登录/注册",
  subtitle: "微光点点，温暖常在",
  phonePlaceholder: "请输入手机号",
  codePlaceholder: "请输入验证码",
  submitBtn: "立即进入",
  sendCodeBtn: "获取验证码"
};
