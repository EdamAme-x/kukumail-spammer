import { Logger } from "./infrastructure/drivers/logger.ts";
import { Arguments } from "./infrastructure/gateways/arguments.ts";

if (import.meta.main) {
    const logger = new Logger();
    logger.log("Setup Mail Spammer by kukumail.js | Github:EdamAme-x/kukumail.js");
    const args = new Arguments(Deno.args, {
        "t": "--target",
        "k": "--token",
        "s": "--subject",
        "m": "--message",
    })

    if (args.getFlat().length !== 0) {
        logger.log("Invalid arguments", "error");
        logger.log("Usage: ~/index.ts -t <target@email.addr> -k <token> -s <subject> -m <message>", "error");
        Deno.exit(1);
    }else {
    }
}