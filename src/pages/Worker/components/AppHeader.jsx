import React from "react";
import styled from "styled-components";
import { COLOR } from "../../../common/variables";
import MenuIcon from "@mui/icons-material/Menu";
import { appDrawerOpenAtom } from "../../../helpers/atom";
import { useAtom } from "jotai";
import transl from "../../components/translate";
import InventoryIcon from "@mui/icons-material/Inventory";
import { Link } from "react-router-dom";

const AppHeaderStyled = styled.div`
    color: ${COLOR.white};
    background: ${COLOR.gradient};
`;

function AppHeader({ children, projectID }) {
    const [, setDrawerOpen] = useAtom(appDrawerOpenAtom);
    return (
        <AppHeaderStyled className="text-white pt-8 relative pb-16 -mb-10 ">
            <div className="md:max-w-2xl mx-auto container flex justify-between">
                {children}

                <div className="flex items-start  ml-9">
                    {projectID && (
                        <Link
                            to={`/app/resources/${projectID}`}
                            className="flex-shrink-0 mr-2 text-center w-16"
                        >
                            <InventoryIcon sx={{ mt: 1 }} />
                            <span className="block text-xs mt-1">
                                {transl("project resources")}
                            </span>
                        </Link>
                    )}
                    <button
                        className="flex-shrink-0"
                        onClick={() => {
                            setDrawerOpen(true);
                        }}
                    >
                        <MenuIcon sx={{ fontSize: 40 }} />
                    </button>
                </div>
            </div>
        </AppHeaderStyled>
    );
}

export default AppHeader;
