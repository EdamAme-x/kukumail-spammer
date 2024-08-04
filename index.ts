import { Metadata } from "./application/entities/metadata.ts";
import { Logger } from "./infrastructure/drivers/logger.ts";
import { Arguments } from "./infrastructure/gateways/arguments.ts";
import { Spam } from "./application/usecase/spam.ts";

if (import.meta.main) {
  const logger = new Logger();
  logger.log(
    "Setup KukuMail Spammer by kukumail.js | Github:EdamAme-x/kukumail.js",
  );
  const args = new Arguments(Deno.args, {
    "t": "--target",
    "k": "--token",
    "s": "--subject",
    "m": "--message",
  });

  if (args.getFlat().length !== 0) {
    logger.log("Invalid arguments", "error");
    logger.log(
      "Usage: ~/index.ts -t <target@email.addr> -k <token> -s <subject> -m <message>",
      "error",
    );
    Deno.exit(1);
  } else {
    const target = args.get("target") || args.get("t");
    const token = args.get("token") || args.get("k");
    const subject = args.get("subject") || args.get("s");
    const message = args.get("message") || args.get("m");
    if (target && token && subject && message) {
      const metadata = new Metadata({
        token,
        target,
        subject,
        message,
      });
      if (metadata.isValid()) {
        const spam = new Spam(metadata, logger);
        await spam.execute();
      } else {
        logger.log("Invalid argument format", "error");
        Deno.exit(1);
      }
    } else {
      logger.log("Invalid argument format", "error");
      logger.log(
        "Usage: Please look https://github.com/EdamAme-x/kukumail-spammer",
        "error",
      );
      Deno.exit(1);
    }
  }
}
