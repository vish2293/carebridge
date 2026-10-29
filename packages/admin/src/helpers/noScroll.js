export const toggleBodyClass = (isModalOpen) => {
    if (isModalOpen) {
        if (document.body.style.position !== "fixed") {
            document.body.style.position = "fixed";
            document.body.style.top = "0";
            document.body.style.left = "0";
            document.body.style.width = "100%";
            document.body.style.overflow = "hidden";
        }
    } else {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
    }
    return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
    };
};