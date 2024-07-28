import {FC, useEffect, useRef} from "react";
import {CommandBarProps} from "../model/Command.ts";

const CommandBar: FC<CommandBarProps> = ({commands, showCommands, setShowCommands, sendMessage}) => {
    const useOutsideClick = (callback: () => void) => {
        const ref = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent | TouchEvent) => {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    callback();
                }
            };

            document.addEventListener('mouseup', handleClickOutside);
            document.addEventListener('touchend', handleClickOutside);


            return () => {
                document.removeEventListener('mouseup', handleClickOutside);
                document.removeEventListener('touchend', handleClickOutside);
            };
        }, [callback]);

        return ref;
    };

    const handleClickOutside = () => {
        setShowCommands(false);
    };
    const commandsRef = useOutsideClick(handleClickOutside);

    useEffect(() => {
        if (showCommands && commandsRef.current) {
            commandsRef.current.focus();
        }
    }, [showCommands]);

    if (!showCommands) return null;

    return (
        <div ref={commandsRef} className="commands-container">
            <div className="command-bar">
                {commands.map((cmd, index) => (
                    <div key={index} className="command-item" onClick={() => {
                        sendMessage(cmd.description)
                        setShowCommands(false)
                    }}>
                        <span className="command">/{cmd.command}</span>
                        <span className="description">{cmd.description}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommandBar;