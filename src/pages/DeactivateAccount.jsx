import React from "react";
import ButtonGoToTop from "./Admin/components/ButtonGoToTop";
import transl from "./components/translate";
import AppContainer from "./Worker/components/AppContainer";
import AppContent from "./Worker/components/AppContent";
import AppHeader from "./Worker/components/AppHeader";
import AppMenu from "./Worker/components/AppMenu";

function DeactivateAccount() {
	return (
		<AppContainer>
			<AppHeader>
				<h1 className="text-3xl">{transl("Deactivate Account")}</h1>
			</AppHeader>
			<AppContent>
				<div className="text-center">
					<p>{transl("Your account has been deactivate")}</p>
					<p>
						{transl(
							"Contact the administrator for more information"
						)}
					</p>
				</div>
			</AppContent>
			<AppMenu />
			<ButtonGoToTop size={"small"} />
		</AppContainer>
	);
}

export default DeactivateAccount;
