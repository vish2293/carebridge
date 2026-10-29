export const userRequests = [
    { label: "Housing", value: "Housing" },
    { label: "Food", value: "Food" },
    { label: "Economic", value: "Economic" },
    { label: "Transportation", value: "Transportation" },
    { label: "Childcare", value: "Childcare" },
    { label: "Employment", value: "Employment" },
    { label: "Education", value: "Education" },
    { label: "Health care access", value: "Health care access" }
];
export const programOptions = [
    { label: "Community Care", value: "Community Care" },
    { label: "Vecino", value: "Vecino" },
    { label: "Christ Clinic", value: "Christ Clinic" },
    { label: "Honeycomb", value: "Honeycomb" },
    { label: "St. Joseph", value: "St. Joseph" },
    { label: "HOPWA", value: "HOPWA" },
    { label: "Navigation", value: "Navigation" },
    { label: "Dinner to Home", value: "Dinner to Home" },
    { label: "Seniors", value: "Seniors" },
    { label: "UT-Houston", value: "UT-Houston" }
]

export const stabilityOptions = [
    { label: "Stable", value: "stable" }, { label: "Unstable", value: "unstable" }, { label: "N/A", value: "N/A" }
]

export const initalUserRequest = [
    {
        label: "Housing security",
        options: [
            { label: "Stable", value: "stable" }, { label: "Unstable", value: "unstable" }, { label: "N/A", value: "N/A" }
        ]
    },
    {
        label: "Food security", options: [
            { label: "Stable", value: "stable" }, { label: "Unstable", value: "unstable" }, { label: "N/A", value: "N/A" }
        ]
    },
    {
        label: "Economic security", options: [
            { label: "Stable", value: "stable" }, { label: "Unstable", value: "unstable" }, { label: "N/A", value: "N/A" }
        ]
    },
    {
        label: "Transportation security: ", options: [
            { label: "Stable", value: "stable" }, { label: "Unstable", value: "unstable" }, { label: "N/A", value: "N/A" }
        ]
    },
    {
        label: "Childcare security", options: [
            { label: "Stable", value: "stable" }, { label: "Unstable", value: "unstable" }, { label: "N/A", value: "N/A" }
        ]
    },
    {
        label: "Employment security", options: [
            { label: "Stable", value: "stable" }, { label: "Unstable", value: "unstable" }, { label: "N/A", value: "N/A" }
        ]
    },
    {
        label: "Education security", options: [
            { label: "Stable", value: "stable" }, { label: "Unstable", value: "unstable" }, { label: "N/A", value: "N/A" }
        ]
    },
    {
        label: " Health care access security", options: [
            { label: "Stable", value: "stable" }, { label: "Unstable", value: "unstable" }, { label: "N/A", value: "N/A" }
        ]
    }
];

export const objectiveOptions = [
    { label: "Stable", value: "stable" }, { label: "Unstable", value: "unstable" }, { label: "N/A", value: "N/A" }
]

export const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "FeMale", value: "FeMale" },
    { label: "Other", value: "Other" },
];

export const ClientVisitType = [
    { label: "Phone Call", value: "Phone Call" },
    { label: "In-person", value: "In-Person" },
    { label: "Text", value: "Text" },
    { label: "Email", value: "Email" },
    { label: "Virtual", value: "Virtual" }
];

export const filterClientStatus = [
    { label: "Pending", value: "Pending" },
    { label: "Open", value: "Open" },
    { label: "Closed-Inactive", value: "Closed-Inactive" },
    { label: "Closed-Success", value: "Closed-Success" },
];

export const questionTypeOptions = [
    { label: "Radio Button", value: "radio" },
    { label: "Text Field", value: "text" },
    { label: "Text Area", value: "textArea" },
    { label: "Calendar", value: "date" }
];

export const RequestStatus = [
    { label: "Pending", value: "Pending" },
    { label: "In-Progress", value: "In-Progress" },
    { label: "Unsuccessful", value: "Unsuccessful" },
    { label: "Cancelled", value: "Cancelled" },
    { label: "Completed", value: "Completed" }
];

export const filterQuestion = [
    { label: "Housing", value: "Housing" },
    { label: "Food", value: "Food" },
    { label: "Economic/Cash", value: "Economic/Cash" },
    { label: "Transportation", value: "Transportation" },
    { label: "Childcare", value: "Childcare" },
    { label: "Employment", value: "Employment" },
    { label: "Education", value: "Education" },
    { label: "Health care access", value: "Health care access" }
];
export const TaskStatusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "In-Progress", value: "In-Progress" },
    { label: "Completed", value: "Completed" },
];
export const oldTaskStatusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Completed", value: "Completed" },
    { label: "Canceled", value: "Canceled" },
]

export const visitLists = [
    { id: 1, description: "This is description for vist 1", date: "11/03/2024", no_of_requests: 2, visit_type: "In person" },
    { id: 2, description: "This is description for vist 2", date: "14/03/2024", no_of_requests: 2, visit_type: "Online" },
    { id: 3, description: "This is description for vist 3", date: "17/03/2024", no_of_requests: 4, visit_type: "Phone" },
    { id: 4, description: "This is description for vist 4", date: "19/03/2024", no_of_requests: 1, visit_type: "In person" },
    { id: 5, description: "This is description for vist 5", date: "21/03/2024", no_of_requests: 0, visit_type: "Online" },
]

export const TimeOptions = [{ label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }]

export const initialObjectiveValue = [
    { label: "housingSecurity", value: "N/A" },
    { label: "foodSecurity", value: "N/A" },
    { label: "economicSecurity", value: "N/A" },
    { label: "transportationSecurity", value: "N/A" },
    { label: "childcareSecurity", value: "N/A" },
    { label: "employmentSecurity", value: "N/A" },
    { label: "educationSecurity", value: "N/A" },
    { label: "healthcareSecurity", value: "N/A" }
]

export const objectiveTypeOptions = [
    { value: "housingSecurity", label: "Housing security" },
    { value: "foodSecurity", label: "Food security" },
    { value: "economicSecurity", label: "Economic security" },
    { value: "transportationSecurity", label: "Transportation security" },
    { value: "childcareSecurity", label: "Childcare security" },
    { value: "employmentSecurity", label: "Employment security" },
    { value: "educationSecurity", label: "Education security" },
    { value: "healthcareSecurity", label: "Healthcare security" }
]
export const typeValueOption = [
    { label: "Stable", value: "stable" },
    { label: "Unstable", value: "unstable" },
    { label: "N/A", value: "N/A" }
]

export const noteStatus = [
    { label: "Answered", value: "Answered" },
    { label: "Not-Answered", value: "Not-Answered" },
]

export const NotesContactType = [
    { label: "Phone Call", value: "Phone Call" },
    { label: "In-person", value: "In-Person" },
    { label: "Text", value: "Text" },
    { label: "Email", value: "Email" },
    { label: "Virtual", value: "Virtual" }
];