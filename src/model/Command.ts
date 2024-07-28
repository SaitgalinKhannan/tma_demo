export default interface Command {
    command: string;
    description: string;
}

export interface CommandBarProps {
    commands: Command[];
    showCommands: boolean;
    setShowCommands: (showCommands: boolean) => void;
    sendMessage: (message: string) => void;
}