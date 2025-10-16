import logo from "../../assets/branding/heval-logo-main.png";
import Button from "@mui/material/Button/Button";
import React, { FC } from "react";
import { Link } from "react-router-dom";

import { useSystemInfo } from "hooks/useSystemInfo";

const ServerButton: FC = () => {
    const { data: systemInfo, isPending } = useSystemInfo();

    return (
        <Button
            variant="text"
            size="large"
            color="inherit"
            startIcon={
                <img
                    src={logo}
                    alt="Heval-Media"
                    aria-hidden
                    style={{
                        maxHeight: "1.25em",
                        maxWidth: "1.25em",
                    }}
                />
            }
            component={Link}
            to="/"
        >
            {/* Show fixed brand name in header instead of server name */}
            {isPending ? "" : "Heval-Media"}
        </Button>
    );
};

export default ServerButton;
