import { getRepository } from "@/models";
import { WaVersion } from "@/models/wa-version.model";
import makeWASocket, { Browsers, fetchLatestBaileysVersion, useMultiFileAuthState, type WASocket } from "@whiskeysockets/baileys";
import { sleep } from "bun";



export async function connctWa() {
    const { saveCreds, state } = await useMultiFileAuthState('data-wa');
    const versionRepository = getRepository(WaVersion);
    const currentVersion = await versionRepository.findOneOrFail({ withDeleted: false, where: {} });
    const version = JSON.parse(currentVersion.response);
    const sock: WASocket = makeWASocket({
        auth: state,
        browser: Browsers.ubuntu("Google Chrome (Linux)"),
        printQRInTerminal: true,
        version: version.version,
    });
    sock.ev.on("creds.update", saveCreds);
    return sock;
}

export async function listenWaVersion() {
    let latest = true;
    while (latest) {
        latest = await writeLatestWaVersion();
        await sleep(1000 * 60 * 60 * 24);
    }
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
        }
    } else {
        const version = versionRepository.create({ response: JSON.stringify(versions), version: versions.version.join('-') });
        await versionRepository.save(version);
    }
    return true;
}
