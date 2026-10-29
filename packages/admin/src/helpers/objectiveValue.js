export const getObjectiveValues = (label) => {
    switch (label) {
        case "housingSecurity":
            return "Housing security"
        case "foodSecurity":
            return "Food security"
        case "economicSecurity":
            return "Economic security"
        case "transportationSecurity":
            return "Transportation security"
        case "childcareSecurity":
            return "Childcare security"
        case "employmentSecurity":
            return "Employment security"
        case "educationSecurity":
            return "Education security"
        case "healthcareSecurity":
            return "Healthcare security"
        default:
            return;
    }
}