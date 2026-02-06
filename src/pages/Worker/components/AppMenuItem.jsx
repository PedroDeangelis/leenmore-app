import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SignoutApp from "./SignoutApp";

const Content = ({ children, title }) => (
    <span className="block text-center">
        {children}
        <span className="block mt-1 text-xs uppercase font-bold tracking-wider">
            {title}
        </span>
    </span>
);

function AppMenuItem({ to, title, children, logout }) {
    const [opacity, setOpacity] = useState("opacity-40");
    const location = useLocation();

    useEffect(() => {
        if (to != null || logout) {
            if (to === location.pathname) {
                setOpacity("opacity-90");
            } else {
                setOpacity("opacity-20");
            }
        } else {
            setOpacity("opacity-20");
        }
    }, [location]);

    return (
        <div className={`mx-3 md:mx-5  ${opacity}`}>
            {to ? (
                <Link to={to}>
                    <Content title={title}>{children}</Content>
                </Link>
            ) : (
                <>
                    {!logout ? (
                        <Content title={title}>{children}</Content>
                    ) : (
                        <SignoutApp>
                            <Content title={title}>{children}</Content>
                        </SignoutApp>
                    )}
                </>
            )}
        </div>
    );
}

export default AppMenuItem;
