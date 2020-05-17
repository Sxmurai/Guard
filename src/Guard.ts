import { Configuration } from "./library/structures";
import { PrismaClient } from "@prisma/client";

(global as any).prisma = new PrismaClient();
(global as any).config = Configuration.getInstance();

import GuardClient from "./library/GuardClient";

import "./library/structures/Formatter";

const client = new GuardClient({
  token: config.get("tokens.discord"),
  prefix: config.get("bot.prefix"),
  owners: config.get("bot.owners"),
});

(async () => {
  await client
    .start()
    .catch((err: Error): void => client.logger.error(`Oopies..\n${err}`));

  // await prisma
  //   .connect()
  //   .catch((err: Error): void =>
  //     client.logger.error(`Welp, that means the DB wont work..\n${err}`)
  //   );
})();
