import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { ReactTerminal } from "react-terminal";
import { fileUploadService } from "@services";
import { useUserStore, useFileUploadStore, useFileFetchStore } from "@states";

export function HomePage() {
    const [key, setKey] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { userData } = useUserStore();
    const {
        localStatus,
        fileMetadata,
        uploadFileDataToLocalRepo,
        uploadFileMetadataToServer
    } = useFileUploadStore();

    const { fetchHostNames } = useFileFetchStore();

    useEffect(() => {
        const handleListFileMetadata = async () => {
            const listFileMetadata = await fileUploadService.getListFileMetadata();
            if (listFileMetadata.length > 0) {
                await fileUploadService.uploadListFileMetadata(
                    {
                        sessionId: userData.sessionId,
                        listFileMetadata: listFileMetadata
                    }
                )
            }
        }

        handleListFileMetadata();
    }, [
        userData.sessionId,
        fileUploadService.getListFileMetadata,
        fileUploadService.uploadListFileMetadata
    ]);

    useEffect(() => {
        if (localStatus === 'SUCCESS') {
            const { sessionId } = userData;
            uploadFileMetadataToServer({
                ...fileMetadata,
                sessionId
            });
        }
    }, [fileMetadata, userData.sessionId, localStatus]);

    const commands = {
        publish: async (fname: string) => {
            if (fname.trim() === '') {
                return "Please provide <fname> after 'publish'"
            }
            const word = fname.trim().split(' ');
            if (word.length === 1) {
                return (
                    <div>
                        <label htmlFor='dropzone-file'>Select a file:</label>
                        <input
                            key={key}
                            ref={fileInputRef}
                            type='file'
                            id='dropzone-file'
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                if (event.target.files) {
                                    setKey((prevKey) => prevKey + 1);
                                    uploadFileDataToLocalRepo(event.target.files[0], fname);
                                }
                            }}
                        ></input>
                    </div>
                );
            } else {
                return "Invalid 'publish' command. Please use 'publish <fname>' to select a file.";
            }
        },
        ls: async (fname: string) => {
            if (fname.trim() === '') {
                return "Please provide <fname> after 'ls'"
            }
            const word = fname.trim().split(' ');
            if (word.length === 1) {
                try {
                    const listHostNames = await fetchHostNames(fname);
                    return (
                        <div>
                            {listHostNames.map((hostName, index) => (
                                <p key={index}>{hostName}</p>
                            ))}
                        </div>
                    )
                } catch (err) {
                    return 'File not found !'
                }
            } else {
                return "Invalid 'ls' command. Please use 'ls <fname>' to list all of hostnames containing fname.";
            }
        },
        fetch: async (fnameAndHostname: string) => {
            const [fname, hostname] = fnameAndHostname.split(' ');

            if (!fname || !hostname) {
                return "Please provide both <fname> and <hostname> separated by a space after 'fetch'";
            }
            const listHostNames = await fetchHostNames(fname);
            if (!listHostNames.includes(hostname)) {
                return `Hostname '${hostname}' not found for '${fname}'.`;
            }
            try {
                const response = await axios.get(`http://${hostname}:8080/api/file/${fname}`);
                const fileData = await axios({
                    method: 'get',
                    url: response.data,
                    responseType: 'blob'
                });
                try {
                    await uploadFileDataToLocalRepo(fileData.data, fname);
                    return 'Fetch operation completed';
                } catch (err) {
                    return 'Fetch operation failed';
                }
            } catch (err) {
                return 'Error saving the file';
            }
        }
    }

    return (
        <ReactTerminal commands={commands} />
    );
}