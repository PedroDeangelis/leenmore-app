import React from "react";
import AppMenuItem from "./AppMenuItem";
import transl from "../../components/translate";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

function AppMenu() {
    return (
        <div
            className="
        fixed bottom-0 left-0 w-full pt-3 pb-9"
        >
            <div className="max-w-2xl flex items-start justify-center mx-auto">
                <AppMenuItem to="/app" title={transl("Home")}>
                    <HomeIcon />
                </AppMenuItem>
                <AppMenuItem to={`/app/receipt-submit`} title="영수증 제출">
                    <ReceiptIcon />
                </AppMenuItem>
                <AppMenuItem to={`/app/my-receipts`} title="영수증 내역 보기">
                    <ReceiptLongIcon />
                </AppMenuItem>
                {/*<AppMenuItem title={transl("Chat")}>
					<ChatIcon />
				</AppMenuItem>
				<AppMenuItem title={transl("Soon")}>
					<SearchIcon />
				</AppMenuItem>
				<AppMenuItem to="/settings" title={transl("Settings")}>
					<SettingsIcon />
				</AppMenuItem>*/}
                <AppMenuItem logout={true} title={transl("Log Out")}>
                    <LogoutIcon />
                </AppMenuItem>
            </div>
        </div>
    );
}

export default AppMenu;
