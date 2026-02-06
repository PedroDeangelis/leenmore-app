import React from "react";
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import transl from "../../components/translate";
import { useNavigate } from "react-router-dom";
import { appDrawerOpenAtom } from "../../../helpers/atom";
import { useAtom } from "jotai";
import InventoryIcon from "@mui/icons-material/Inventory";
import SearchIcon from "@mui/icons-material/Search";

function DrawerMenuBox() {
    const [, setDrawerOpen] = useAtom(appDrawerOpenAtom);
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        setDrawerOpen(false);

        navigate(path);
    };

    return (
        <Box sx={{ width: 250 }} role="presentation">
            <p className="text-center pt-4">{transl("Menu")}</p>
            <List>
                <ListItem>
                    <ListItemButton onClick={() => handleNavigate("/app")}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary={"활동 프로젝트"} />
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton
                        onClick={() => handleNavigate(`/app/receipt-submit/`)}
                    >
                        <ListItemIcon>
                            <ReceiptIcon />
                        </ListItemIcon>
                        <ListItemText primary={"영수증 제출"} />
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton
                        onClick={() => handleNavigate(`/app/my-receipts/`)}
                    >
                        <ListItemIcon>
                            <ReceiptLongIcon />
                        </ListItemIcon>
                        <ListItemText primary={"영수증 내역 보기"} />
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton
                        onClick={() => handleNavigate(`/app/resources/`)}
                    >
                        <ListItemIcon>
                            <InventoryIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={`${transl("project resources")}`}
                        />
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton
                        onClick={() =>
                            handleNavigate(`/app/search-shareholders/`)
                        }
                    >
                        <ListItemIcon>
                            <SearchIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={`${transl("search shareholders")}`}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
}

export default DrawerMenuBox;
