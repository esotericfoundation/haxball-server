import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { ControlPanel } from "../ControlPanel";

export type Command = {
    data: SlashCommandBuilder|Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">,
    execute (interaction: ChatInputCommandInteraction, client: Client, panel: ControlPanel): Promise<unknown>
}