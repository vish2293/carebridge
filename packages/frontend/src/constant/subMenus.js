
import { calenderIcon, clientIcon, dashboardIcon, questionnaierIcon, reportIcon, requestIcon, settingIcon, taskIcon, usersIcon } from "../assets/icons";
import { PATH_LIST } from "./path-list";

//Submenus for dashboard
export const subMenus = [
  {
    name: "Dashboard",
    path: PATH_LIST.user.dashboard,
    icon: dashboardIcon,
    id: "dashboard",
    heading: "Dashboard",
  },
  {
    name: "Assigned Clients",
    path: PATH_LIST.user.users,
    icon: clientIcon,
    id: "client",
    heading: "Client management",
  },
  {
    name: "Requests",
    path: PATH_LIST.user.requests,
    icon: requestIcon,
    id: "request",
    heading: "Request management",
  },
  {
    name: "Visits",
    path: PATH_LIST.user.visitors,
    icon: usersIcon,
    id: "visits",
    heading: "Visits"
  },
  {
    name: "Clients",
    path: PATH_LIST.user.clients,
    icon: clientIcon,
    id: "clients",
    heading: "Clients management",
  },
  {
    name: "Users",
    path: PATH_LIST.user.users,
    icon: clientIcon,
    id: "users",
    heading: "Users management",
  },
  {
    name: "Next Steps",
    path: PATH_LIST.user.task,
    icon: taskIcon,
    id: "todo",
    heading: "Todo management",
  },
  {
    name: "Pathway",
    path: PATH_LIST.user.pathway,
    icon: taskIcon,
    id: "pathway",
    heading: "Pathway management",
  },
  {
    name: "Resources",
    path: PATH_LIST.user.resource,
    icon: taskIcon,
    id: "resource",
    heading: "Resource management",
  },
  {
    name: "Client Intake",
    path: PATH_LIST.user.questionnaire,
    icon: questionnaierIcon,
    id: "questionnaire",
    heading: "Questionnaire management",
  },
  {
    name: "Calendar",
    path: PATH_LIST.user.calendar,
    icon: calenderIcon,
    id: "calendar",
    heading: "Calendar management",
  },
  {
    name: "Reports",
    path: PATH_LIST.user.reports,
    icon: reportIcon,
    id: "reports",
    heading: "Reports management",
    subItem: [
      { label: "Client", key: "clientReport", path: PATH_LIST.user.clientReports },
      { label: "Assigned Clients", key: "assignedClients", path: PATH_LIST.user.clientReports },
      { label: "Next Important Date", key: "nextImportantDateReport", path: PATH_LIST.user.nextImportantDateReport },
      { label: "Action Steps", key: "actionSteps", path: PATH_LIST.user.actionSteps },
      { label: "Visit Report", key: "visitReport", path: PATH_LIST.user.visitReport },
      { label: "Objective", key: "objectiveReport", path: PATH_LIST.user.objectiveReport },
      { label: "Resource Given", key: "resourceGivenReport", path: PATH_LIST.user.resourceGivenReport },
      { label: "Pathways", key: "pathwayReport", path: PATH_LIST.user.pathwayReport },
    ]
  },
  {
    name: "Settings",
    path: PATH_LIST.user.settings,
    icon: settingIcon,
    id: "settings",
    heading: "Settings",
    subItem: [
      { label: "Reminder", key: "reminder", path: PATH_LIST.user.reminder },
      { label: "Appearance", key: "appearance", path: PATH_LIST.user.appearance },
      { label: "Demography", key: "demo_graphy", path: PATH_LIST.user.profileQuestion },
    ]
  },
  {
    name: "Import Clients",
    path: PATH_LIST.user.importClient,
    icon: calenderIcon,
    id: "importClient",
    heading: "Import Clients",
  },
];

//Child menu of Report
