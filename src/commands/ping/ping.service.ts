import {
  ButtonInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  SelectMenuInteraction,
} from "discord.js";

export const defaultComponents: MessageActionRow[] = [
  new MessageActionRow().addComponents([
    new MessageButton()
      .setCustomId("ping-button1")
      .setStyle("SUCCESS")
      .setLabel("Test"),
    new MessageButton()
      .setCustomId("test2")
      .setStyle("DANGER")
      .setLabel("Unimplemented Button"),
  ]),
  new MessageActionRow().addComponents([
    new MessageSelectMenu().setCustomId("ping-myselect").addOptions([
      {
        label: "First option",
        value: "first",
        description: "This is the first opton available.",
        emoji: "1️⃣",
      },
      {
        label: "Second option",
        value: "second",
        description: "This is the second opton available.",
        emoji: "2️⃣",
      },
      {
        label: "Third option",
        value: "third",
        description: "This is the third opton available.",
        emoji: "3️⃣",
      },
    ]),
  ]),
];

export async function testButton(interaction: ButtonInteraction) {
  interaction.message.components?.forEach((row) =>
    row.components.forEach((component) => {
      (component as MessageButton).setDisabled(true);
    })
  );

  (interaction.message as Message).edit({
    components: interaction.message.components as MessageActionRow[],
  });

  interaction.reply(`${interaction.user} pressed the button!`);
}

export async function myPingSelectAction(interaction: SelectMenuInteraction) {
  interaction.reply(
    `${interaction.user} pressed the option with value **${interaction.values[0]}**`
  );
}
