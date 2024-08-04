import { Metadata } from "../entities/metadata.ts";
import { Logger } from "../../infrastructure/drivers/logger.ts";
import { Kukumail } from "jsr:@edamame-x/kukumailjs@1.1.6";

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

  public async execute() {
    const { token, target, subject, message } = this.config;
    this.logger.log("Setup KukuMail Spammer");
    this.logger.setDepth(1);
    this.logger.log("Target: " + target);
    this.logger.log("Token: " + token);
    this.logger.log("Subject: " + subject);
    this.logger.log("Message: " + message.replace(/\n/g, "\\n"));
    try {
      this.logger.setDepth(0).log("Initializing Kukumail");
      const kukumail = new Kukumail({
        sessionHash: token,
      });

      await kukumail.initlize();
      this.logger.setDepth(1).log("Initialized Kukumail");

      const thread = 100;

      this.logger.setDepth(0).log("Getting number of address");
      const beforeAddressList = await kukumail.getEmails();
      if (beforeAddressList.type === "success") {
        const lengthOfOfAddress = beforeAddressList.data.emails.length;
        this.logger.setDepth(1);
        this.logger.log("Number of address: " + lengthOfOfAddress);

        if (lengthOfOfAddress >= thread) {
          this.logger.log("Enough address to spam");
        } else {
          this.logger.log(
            "Shortage of address: " + (thread - lengthOfOfAddress),
          );

          this.logger.log(
            "Creating " + (thread - lengthOfOfAddress) + " address",
          );

          for (let i = 0; i < (thread - lengthOfOfAddress); i++) {
            const email = await kukumail.createRandomEmail();

            if (email.type === "success") {
              this.logger.log("Created address: " + email.data);
            } else {
              this.logger.log("Failed to create address", "error");
            }
          }
        }

        this.logger.setDepth(0).log("Spamming");
        const addressList = await kukumail.getEmails();
        if (addressList.type === "success") {
          const address = addressList.data.emails;

          const onThread = async () => {
            while (address.length > 0) {
              const email = address[Math.floor(Math.random() * address.length)];

              this.logger.setDepth(1).log("Spamming address with " + email.email);

              const result = await kukumail.sendMail(
                email.email,
                target,
                subject,
                message.replace(
                  /%HASH%/g,
                  crypto.randomUUID().replace(/-/g, ""),
                ),
              );

              if (result.type === "success") {
                this.logger.setDepth(1).log("Spammed address with " + email.email);
              } else {
                this.logger.setDepth(1).log(
                  "Failed to spam address with " + email.email,
                  "error",
                );
              }
            }
          };

          for (let i = 0; i < Math.floor(thread / 20); i++) {
            onThread();
          }
        } else {
          throw new Error("Failed to get number of address");
        }
      } else {
        throw new Error("Failed to get number of address");
      }
    } catch (error) {
      this.logger.log(error.message, "error");
      Deno.exit(1);
    }
  }
}
