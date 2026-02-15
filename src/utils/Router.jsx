import React, { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import Login from "../pages/Login/Index";
import PageNotFount from "../pages/PageNotFount";
import { useUserisLoggendIn } from "../hooks/useUser";
import LoadingScreen from "../pages/LoadingScreen";
import ProtectedRoute from "../pages/ProtectedRoute";
import { currentUserAtom } from "../helpers/atom";
import { useAtom } from "jotai";
import DashboardApp from "../pages/Worker/DashboardApp";
import Dashboard from "../pages/Admin/Dashboard/Index";
import ProtectedRouteAdmin from "../pages/Admin/ProtectedRouteAdmin";
import Projects from "../pages/Admin/Projects";
import Submissions from "../pages/Admin/Submissions";
import Users from "../pages/Admin/Users";
import AddNewProject from "../pages/Admin/AddNewProject";
import SingleProject from "../pages/Admin/SingleProject";
import ProjectAddShareholders from "../pages/Admin/ProjectAddShareholders";
import SingleUser from "../pages/Admin/SingleUser";
import AddNewUser from "../pages/Admin/AddNewUser";
import SingleProjectApp from "../pages/Worker/SingleProjectApp";
import SingleShareholderApp from "../pages/Worker/SingleShareholderApp";
import Thankyou from "../pages/Worker/Thankyou";
import SingleSubmission from "../pages/Admin/SingleSubmission";
import DeactivateAccount from "../pages/DeactivateAccount";
import Debug from "../pages/Admin/Debug";
import SubmissionNewSelectShareholder from "../pages/Admin/SubmissionNewSelectShareholder";
import SubmissionNew from "../pages/Admin/SubmissionNew";
import ActivityReport from "../pages/Admin/ActivityReport";
import ReceiptSubmit from "../pages/Worker/ReceiptSubmit";
import ReceiptArchive from "../pages/Worker/ReceiptArchive";
import ReceiptSingle from "../pages/Worker/ReceiptSingle";
import Receipts from "../pages/Admin/Receipts";
import ReceiptSingleAdmin from "../pages/Admin/ReceiptSingleAdmin";
import ReceiptsByProjectAndUser from "../pages/Admin/ReceiptsByProjectAndUser";
import ProjectResources from "../pages/Admin/ProjectResources";
import SingleProjectResource from "../pages/Admin/SingleProjectResource";
import SingleResourceApp from "../pages/Worker/SingleResourceApp";
import ProjectResourceArchiveApp from "../pages/Worker/ProjectResourceArchiveApp";
import ActivityData from "../pages/Admin/ActivityData";
import SingleActivityData from "../pages/Admin/SingleActivityData";
import SearchShareholdersApp from "../pages/Worker/SearchShareholdersApp";
import EmailToWorker from "../pages/Admin/EmailToWorker";
import SingleEmailToWorker from "../pages/Admin/SingleEmailToWorker";

function Router() {
    const { data, isLoading, isFetching } = useUserisLoggendIn();
    const [, setCurrentUser] = useAtom(currentUserAtom);

    useEffect(() => {
        if (data) {
            setCurrentUser(data);
        }
    }, [data, setCurrentUser]);

    const element = useRoutes([
        {
            path: "/",
            element: <Login />,
        },
        {
            path: "/deactivate-account",
            element: <DeactivateAccount />,
        },
        {
            path: "/dashboard",
            element: <ProtectedRouteAdmin />,
            children: [
                {
                    index: true,
                    element: <Dashboard />,
                },
                {
                    path: "/dashboard/project",
                    element: <Projects />,
                },
                {
                    path: "/dashboard/debug",
                    element: <Debug />,
                },
                {
                    path: "/dashboard/project/:id",
                    element: <SingleProject />,
                },
                {
                    path: "/dashboard/project/:id/add-more-shareholders",
                    element: <ProjectAddShareholders />,
                },
                {
                    path: "/dashboard/project/add-new",
                    element: <AddNewProject />,
                },
                {
                    path: "/dashboard/submission",
                    element: <Submissions />,
                },
                {
                    path: "/dashboard/activity-report/new/:project_id",
                    element: <SubmissionNewSelectShareholder />,
                },
                {
                    path: "/dashboard/submission/:type/:id",
                    element: <SingleSubmission />,
                },
                {
                    path: "/dashboard/user",
                    element: <Users />,
                },
                {
                    path: "/dashboard/user/:id",
                    element: <SingleUser />,
                },
                {
                    path: "/dashboard/user/add-new",
                    element: <AddNewUser />,
                },
                {
                    path: "/dashboard/activity-report",
                    element: <ActivityReport />,
                },
                {
                    path: "/dashboard/activity-report/new/:project_id/:shareholder_id",
                    element: <SubmissionNew />,
                },
                {
                    path: "/dashboard/receipt",
                    element: <Receipts />,
                },
                {
                    path: "/dashboard/receipt/:receipt_id",
                    element: <ReceiptSingleAdmin />,
                },
                {
                    path: "/dashboard/receipt/user/:user_id",
                    element: <ReceiptsByProjectAndUser />,
                },
                {
                    path: "/dashboard/resources",
                    element: <ProjectResources />,
                },
                {
                    path: "/dashboard/resources/:project_id",
                    element: <SingleProjectResource />,
                },
                {
                    path: "/dashboard/activity-data/",
                    element: <ActivityData />,
                },
                {
                    path: "/dashboard/activity-data/:project_id",
                    element: <SingleActivityData />,
                },
                {
                    path: "/dashboard/email-to-worker/",
                    element: <EmailToWorker />,
                },
                {
                    path: "/dashboard/email-to-worker/:project_id",
                    element: <SingleEmailToWorker />,
                },
            ],
        },
        {
            path: "/app",
            element: <ProtectedRoute />,
            children: [
                {
                    index: true,
                    element: <DashboardApp />,
                },
                {
                    path: "/app/project/:id",
                    element: <SingleProjectApp />,
                },
                {
                    path: "/app/project/:id/thankyou",
                    element: <Thankyou />,
                },
                {
                    path: "/app/project/:project_id/shareholder/:id",
                    element: <SingleShareholderApp />,
                },
                {
                    path: "/app/receipt-submit",
                    element: <ReceiptSubmit />,
                },
                {
                    path: "/app/my-receipts",
                    element: <ReceiptArchive />,
                },
                {
                    path: "/app/my-receipts/:receipt_id",
                    element: <ReceiptSingle />,
                },
                {
                    path: "/app/resources",
                    element: <ProjectResourceArchiveApp />,
                },
                {
                    path: "/app/resources/:project_id",
                    element: <SingleResourceApp />,
                },
                {
                    path: "/app/search-shareholders",
                    element: <SearchShareholdersApp />,
                },
            ],
        },

        {
            path: "*",
            element: <PageNotFount />,
        },
    ]);
    return <>{isLoading || isFetching ? <LoadingScreen /> : element}</>;
}

export default Router;
