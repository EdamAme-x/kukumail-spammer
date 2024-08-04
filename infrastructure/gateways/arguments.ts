import { parseArgs } from "jsr:@std/cli/parse-args";

export class Arguments {
  private parsedArgs:
    & Record<string, string | undefined>
    & Record<"_", string[]>;

  constructor(args: string[], alias: Record<string, string>) {
    this.parsedArgs = parseArgs(args, {
      "--": false,
      alias,
    });
  }

  public get(key: string) {
    return this.parsedArgs[key];
  }

  public getFlat() {
    return this.parsedArgs._;
  }
}
