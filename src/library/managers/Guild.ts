import { AkairoClient } from "discord-akairo";
import ms from "ms";

export default class Guild {
  public async check(client: AkairoClient) {
    for (const infraction of await prisma.infractions.findMany()) {
      if (infraction.duration === 0) return;

      const guild = client.guilds.resolve(infraction.id);
      if (!guild) return;

      if (infraction.duration <= Date.now()) {
        switch (infraction.type) {
          case "ban":
            const user = client.users.resolve(infraction.target);
            if (!user) return;

            const ban = await guild.fetchBan(user).catch(() => null);
            if (!ban) return;

            await guild.members.unban(
              user,
              `Times up! Duration of ban: ${ms(infraction.duration, {
                long: true,
              })}`
            );

            infraction.duration = null;

            await prisma.infractions.update({
              where: { id: guild.id },
              data: infraction,
            });

            break;
        }
      }
    }
  }
}
