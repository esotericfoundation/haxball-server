import { ChatInputCommandInteraction, Client, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import { ControlPanel } from "../ControlPanel";

export type Command = {
    data: SlashCommandBuilder|Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">|SlashCommandOptionsOnlyBuilder,
    execute (interaction: ChatInputCommandInteraction, client: Client, panel: ControlPanel): Promise<unknown>
}