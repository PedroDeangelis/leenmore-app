import Router from "./utils/Router";
import { QueryClientProvider, QueryClient } from "react-query";
import { Provider } from "jotai";
import Theme from "./common/Theme";
import GlobalStyles from "./common/GlobalStyles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	// Create a client
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				staleTime: Infinity,
			},
		},
	});

	return (
		<QueryClientProvider client={queryClient}>
			<Provider>
				<Theme>
					<GlobalStyles />
					<Router />
					<ToastContainer />
				</Theme>
			</Provider>
		</QueryClientProvider>
	);
}

export default App;
