import { brightGreen, green, red } from "jsr:@ryu/enogu";

export class Logger {
  constructor() {}

  private currentDepth = 0;
  private createIndent(type: "log" | "error") {
    return "  ".repeat(this.currentDepth) +
      (type === "error"
        ? red
        : (this.currentDepth === 0
          ? green
          : this.currentDepth === 1
          ? brightGreen
          : green))("-> ");
  }

  public setDepth(depth: number) {
    this.currentDepth = depth;
    return this;
  }

  public log(message: string, type: "log" | "error" = "log") {
    console.log(this.createIndent(type) + message);
    return this;
  }
}
