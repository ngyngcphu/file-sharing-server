import { ReactTerminal } from "react-terminal";
import axios from "axios";
import moment from "moment";
import { hostNameService } from "@services";
import { formatFileSize } from "@utils";

export function HomePage() {
    const commands = {
        ls: async (clientsAndActive: string) => {
            const [clients, active] = clientsAndActive.split(' ');
            if (!clients || !active) {
                return "Wrong format of command 'ls'. Please use 'ls clients active'";
            }

            const listHostNames = await hostNameService.getAll();
            if (listHostNames.length > 0) {
                return (
                    <div>
                        {listHostNames.map((hostName, index) => (
                            <p key={index}>{hostName}</p>
                        ))}
                    </div>
                )
            } else {
                return 'There are no available clients';
            }
        },
        discover: async (hostName: string) => {
            if (hostName.trim() === '') {
                return "Please provide <hostname> after 'discover'"
            }
            const word = hostName.trim().split(' ');
            if (word.length === 1) {
                const listHostNames = await hostNameService.getAll();
                if (!listHostNames.includes(hostName)) {
                    return `Hostname '${hostName}' not found.`;
                }

                const listFileMetadata = await hostNameService.discover(hostName);
                if (listFileMetadata.length > 0) {
                    return (
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Size</th>
                                    <th>Shared Time</th>
                                    <th>Is Available</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listFileMetadata.map((file, index) => (
                                    <tr key={index}>
                                        <th>{file.name}</th>
                                        <th>{file.type}</th>
                                        <th>{formatFileSize(file.size)}</th>
                                        <th>{moment.unix(file.sharedTime).format('HH:mm, DD/MM/YYYY')}</th>
                                        <th>{`${file.isAvailable}`}</th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                } else {
                    return 'Hostname has not published any files yet !';
                }
            } else {
                return "Invalid 'discover' command. Please use 'discover <hostname>'.";
            }
        },
        ping: async (hostName: string) => {
            if (hostName.trim() === '') {
                return "Please provide <hostname> after 'ping'"
            }
            const word = hostName.trim().split(' ');
            if (word.length === 1) {
                try {
                    const ipAddress = await hostNameService.transfer(hostName);
                    try {
                        const liveSignal = await axios.get(`http://${ipAddress}:8080/api/ping`);
                        return `(${ipAddress}) ${liveSignal.data}`;
                    } catch (err) {
                        return `(${ipAddress}) Dead !`;
                    }
                } catch (err) {
                    return 'HostName not found !';
                }
            } else {
                return "Invalid 'ping' command. Please use 'ping <hostname>'.";
            }
        }
    }

    return (
        <ReactTerminal commands={commands} />
    );
}