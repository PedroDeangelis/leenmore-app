import Router from "./utils/Router";
import { QueryClientProvider, QueryClient } from "react-query";
import { Provider } from "jotai";
import Theme from "./common/Theme";
import GlobalStyles from "./common/GlobalStyles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Created once at module scope. Building it inside App() meant every re-render
// of App constructed a new client and discarded the entire query cache.
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000,
			cacheTime: 10 * 60 * 1000,
			retry: 1,
		},
	},
});

function App() {
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
