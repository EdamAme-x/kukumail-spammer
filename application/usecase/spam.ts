import { Metadata } from "../entities/metadata.ts";
import { Logger } from "../../infrastructure/drivers/logger.ts";

export class Spam {
  config: NonNullable<Metadata["config"]>;
  logger: Logger;

  constructor(metadata: Metadata, logger: Logger) {
    if (metadata.isValid()) {
      this.config = metadata.getConfig()!;
    } else {
      logger.log("Invalid metadata", "error");
      Deno.exit(1);
    }

    this.logger = logger;
  }


}
