import {FC, useEffect, useState} from "react";
import {Alert, Snackbar} from "@mui/material";

interface CustomAlertProps {
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
}

const CustomAlert: FC<CustomAlertProps> = ({message, severity}) => {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Snackbar
            sx={{position: "absolute"}}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            autoHideDuration={1000}
            onClose={() => setOpen(false)}
        >
            <Alert onClose={() => setOpen(false)} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomAlert;