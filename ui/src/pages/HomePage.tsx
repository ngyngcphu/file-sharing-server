import { ReactTerminal } from "react-terminal";
import { hostNameService } from "@services";

export function HomePage() {
    const commands = {
        ls: async () => {
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
        }
    }

    return (
        <ReactTerminal commands={commands} />
    );
}