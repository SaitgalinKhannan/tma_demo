import {IconButton, Stack, Typography} from "@mui/material";
import {ArrowBackIosNew} from "@mui/icons-material";

export declare interface NavBarProps {
    text?: string;
    navigateTo: string;
}

function NavigationBar(props: NavBarProps) {

    return (
        <Stack
            direction="row"
            spacing={2}
            justifyContent="start"
            borderBottom="1px solid"
            borderColor={"#1876d3"}
        >
            <IconButton
                aria-label="back"
                size="large"
                onClick={() => {}}
            >
                <ArrowBackIosNew color="primary"/>
            </IconButton>
            <Typography
                fontSize="28px"
                alignSelf="center"
            >
                {props.text}
            </Typography>
        </Stack>
    );
}

export default NavigationBar;