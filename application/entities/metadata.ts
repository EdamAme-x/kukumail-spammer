const REGEX_TOKEN = /^SHASH%3A[a-z0-9]{32}$/;
const REGEX_EMAIL = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/;
const REGEX_SUBJECT = /^[\w\W]{0,255}$/;
const REGEX_MESSAGE = /^[\w\W]{0,5000}$/;

export class Metadata {
  private config: {
    token: string;
    target: string;
    subject: string;
    message: string;
  } | null;

  constructor(
    config: {
      token: string;
      target: string;
      subject: string;
      message: string;
    },
  ) {
    if (
      REGEX_TOKEN.test(config.message) && REGEX_EMAIL.test(config.target) &&
      REGEX_SUBJECT.test(config.subject) && REGEX_MESSAGE.test(config.message)
    ) {
      this.config = config;
    } else {
      this.config = null;
    }
  }

  public isValid() {
    return this.config !== null;
  }

  public getConfig() {
    return this.config;
  }
}
