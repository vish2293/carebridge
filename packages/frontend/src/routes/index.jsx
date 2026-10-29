import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { PATH_LIST } from "../constant/path-list";
import Appearance from "../view/Appearance";
import Calendar from "../view/Calendar";
import ChangePassword from "../view/ChangePassword";
import ChwDetaile from "../view/ChwDetaile";
import ClientRequestForm from "../view/ClientRequestForm";
import Clients from "../view/Clients";
import Contact from "../view/Contact";
import Dashboard from "../view/Dashboard";
import DemoGraphy from "../view/Demography";
import ImportClient from "../view/ImportClient";
import Layout from "../view/Layout";
import LogIn from "../view/LogIn";
import Onboarding from "../view/Onboarding";
import PageNotFound from "../view/PageNotFound";
import Profile from "../view/Profile";
import Questionnaire from "../view/Questionnaire";
import Reminder from "../view/Reminder";
import ActionSteps from "../view/Reports/ActionSteps";
import ClientReport from "../view/Reports/ClientReport";
import NextImportantDateReport from "../view/Reports/NextImportantDateReport";
import ObjectiveReport from "../view/Reports/ObjectiveReport";
import VisitReport from "../view/Reports/VisitReport";
import RequestDetaile from "../view/RequestDetaile";
import ResetPassword from "../view/ResetPassword";
import Resource from "../view/Resources";
import SetPasswords from "../view/SetPassword";
import SignUp from "../view/SignUp";
import Task from "../view/Task";
import TodoDetail from "../view/TodoDetail";
import UserDetaile from "../view/UserDetaile";
import Users from "../view/Users";
import VerifyEmaile from "../view/VerifyEmaile";
import VisitDetail from "../view/VisitDetail";
import Visits from "../view/Visits";
import LandingPage from "../view/static";
import MergeDetails from "../view/MergeDetails";
import ResoruceGivenReport from "../view/Reports/ResoruceGivenReport";
import { SetPasswordForPA } from "../view/SetPasswordForPA";
import Pathway from "../view/Pathway";
import PathwaysReport from "../view/Reports/Pathways";
import MFALogIn from "../view/MultiFactor";

const RouterList = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path={PATH_LIST.user.dashboard} element={<Layout />}>
          <Route path={PATH_LIST.user.dashboard} element={<Dashboard />} />
          <Route path={PATH_LIST.user.clients} element={<Clients />} />
          <Route path={PATH_LIST.user.users} element={<Users />} />
          <Route path={PATH_LIST.user.userDetail} element={<UserDetaile />} />
          <Route path={PATH_LIST.user.todoDetail} element={<TodoDetail />} />
          <Route path={PATH_LIST.user.profile} element={<Profile />} />
          <Route path={PATH_LIST.user.chwDetail} element={<ChwDetaile />} />
          <Route path={PATH_LIST.user.task} element={<Task />} />
          <Route
            path={PATH_LIST.user.questionnaire}
            element={<Questionnaire />}
          />
          <Route path={PATH_LIST.user.resource} element={<Resource />} />
          <Route
            path={PATH_LIST.user.clientReports}
            element={<ClientReport />}
          />
          <Route
            path={PATH_LIST.user.nextImportantDateReport}
            element={<NextImportantDateReport />}
          />
          <Route path={PATH_LIST.user.actionSteps} element={<ActionSteps />} />
          <Route path={PATH_LIST.user.visitReport} element={<VisitReport />} />
          <Route
            path={PATH_LIST.user.objectiveReport}
            element={<ObjectiveReport />}
          />
          <Route
            path={PATH_LIST.user.resourceGivenReport}
            element={<ResoruceGivenReport />}
          />
          <Route
            path={PATH_LIST.user.pathwayReport}
            element={<PathwaysReport />}
          />
          {/* <Route path={PATH_LIST.user.requests} element={<Requests />} /> */}
          <Route path={PATH_LIST.user.visitors} element={<Visits />} />
          <Route path={PATH_LIST.user.visitDetail} element={<VisitDetail />} />
          <Route
            path={PATH_LIST.user.listDuplicate}
            element={<MergeDetails />}
          />
          <Route
            path={PATH_LIST.user.singleRequests}
            element={<RequestDetaile />}
          />
          <Route path={PATH_LIST.user.calendar} element={<Calendar />} />
          <Route
            path={PATH_LIST.user.profileQuestion}
            element={<DemoGraphy />}
          />
          <Route path={PATH_LIST.user.reminder} element={<Reminder />} />
          <Route path={PATH_LIST.user.appearance} element={<Appearance />} />
          <Route
            path={PATH_LIST.user.importClient}
            element={<ImportClient />}
          />
          <Route path={PATH_LIST.user.pathway} element={<Pathway />} />
        </Route>
        <Route path={PATH_LIST.onBoarding} element={<Onboarding />} />
        <Route
          path={PATH_LIST.clientRequestForm}
          element={<ClientRequestForm />}
        />
        <Route path={PATH_LIST.home} element={<LandingPage />} />
        <Route path={PATH_LIST.verify} element={<VerifyEmaile />} />
        <Route path={PATH_LIST.login} element={<LogIn />} />
        <Route path={PATH_LIST.otp} element={<MFALogIn />} />
        <Route path={PATH_LIST.resetPassword} element={<ResetPassword />} />
        <Route path={PATH_LIST.setPassword} element={<SetPasswords />} />
        <Route
          path={PATH_LIST.setPasswordforPA}
          element={<SetPasswordForPA />}
        />
        <Route path={PATH_LIST.changePasswrord} element={<ChangePassword />} />
        <Route path={PATH_LIST.signup} element={<SignUp />} />
        <Route path={PATH_LIST.contactus} element={<Contact />} />
        <Route path={PATH_LIST.pageNotFound} element={<PageNotFound />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default RouterList;
