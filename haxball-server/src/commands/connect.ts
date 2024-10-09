import {
	clientPort,
	expressPort,
	maxTimeSSHConnection,
	serverPort,
	wsPort,
} from "../Global";

import tunnel, {Config} from "tunnel-ssh";

import {ConnectInterface} from "../debugging/DebuggingInterface";
import {DebuggingClient} from "../debugging/DebuggingClient";

import open from "open";

type Tunnel = {port: number; server: any};

const openTunnel = (config: tunnel.Config) => {
	return tunnel({...config, readyTimeout: maxTimeSSHConnection});
};

export const connect = async (connectConfig: Config) => {
	let tunnels: Tunnel[] = [];

	console.log("Establishing remote connection...");

	openTunnel({
		...connectConfig,
		dstPort: serverPort,
		localPort: clientPort,
	}).on("error", (err) => {
		console.error(`Error: ${err.message}`);
		console.error("A Haxball Server connection could not be opened.");
		process.exit();
	});

	const client = new DebuggingClient();

	client.on("set", async (rooms) => {
		for (const room of rooms) {
			const tunnelSrv = openTunnel({
				...connectConfig,
				dstPort: room.server,
				localPort: room.client,
			});

			tunnels.push({port: room.client, server: tunnelSrv});
		}

		const url = new ConnectInterface().listen(expressPort, wsPort, client);

		await open(url);
	});

	// eslint-disable-next-line @typescript-eslint/no-shadow
	client.on("add", async (server, client) => {
		const tunnelSrv = openTunnel({
			...connectConfig,
			dstPort: server,
			localPort: client,
		}).on("error", (err) => {
			console.error(`Error: ${err.message}`);
			console.error("Failed to connect to room.");
		});

		tunnels.push({port: client, server: tunnelSrv});
	});

	// eslint-disable-next-line @typescript-eslint/no-shadow
	client.on("remove", async (_server, client) => {
		// eslint-disable-next-line @typescript-eslint/no-shadow
		const tunnel = tunnels.find((t) => t.port === client);

		if (tunnel) {
			tunnel.server?.close();
			tunnels = tunnels.filter((t) => t.port !== tunnel.port);
		}
	});

	client.listen(clientPort);
};
