import { getRepository } from "@/models";
import { WaVersion } from "@/models/wa-version.model";
import makeWASocket, { Browsers, fetchLatestBaileysVersion, useMultiFileAuthState, type WASocket } from "@whiskeysockets/baileys";
import { sleep } from "bun";
import { generate } from 'qrcode-terminal'

export let sock: WASocket | null = null;
export let waConnected = false;

export async function connctWa() {
    listenWaVersion().catch(console.log);
    await sleep(1000);
    const { saveCreds, state } = await useMultiFileAuthState('data-wa');
    const versionRepository = getRepository(WaVersion);
    const currentVersion = await versionRepository.findOneOrFail({ withDeleted: false, where: {} });
    const version = JSON.parse(currentVersion.response);
    sock = makeWASocket({
        auth: state,
        browser: Browsers.ubuntu("Google Chrome (Linux)"),
        printQRInTerminal: true,
        version: version.version,
    });
    sock.ev.on('connection.update', update => {
        if (update.qr) {
            console.log(`QR is : ${update.qr}`);
            generate(update.qr, { small: true });
        }
        const { connection } = update;
        if (connection === 'close') {
            waConnected = false;
            connctWa().catch(console.log);
        } else if (connection === 'open') {
            console.log("opened connection");
            waConnected = true;
        } else console.log("connecting");
    });
    sock.ev.on("creds.update", saveCreds);
}

export async function listenWaVersion() {
    let latest = true;
    while (latest) {
        latest = await writeLatestWaVersion();
        await sleep(1000 * 60 * 60 * 24);
    }
    connctWa().catch(console.log);
}

async function writeLatestWaVersion(): Promise<boolean> {
    const versionRepository = getRepository(WaVersion);
    const versions = await fetchLatestBaileysVersion();
    console.log(versions);
    const currentVersion = await versionRepository.findOne({ withDeleted: false, where: {} });
    console.log(currentVersion);
    if (currentVersion) {
        if (versions.version.join('-') !== currentVersion.version) {
            await currentVersion.softRemove();
            const version = versionRepository.create({ response: JSON.stringify(versions), version: versions.version.join('-') });
            await versionRepository.save(version);
            return false;
        }
    } else {
        const version = versionRepository.create({ response: JSON.stringify(versions), version: versions.version.join('-') });
        await versionRepository.save(version);
    }
    return true;
}
