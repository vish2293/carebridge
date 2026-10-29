export const getTalkedWithCHW = (profileQuestion) => {
    if (!profileQuestion) return "-";

    const question = profileQuestion.find((q) =>
        q?.question?.questionML?.some(
            (ml) =>
                ml.key === "en" &&
                ml.value ===
                "Have you talked to a BOL Community Health Worker? If yes, please select which person spoke with you"
        )
    );

    if (!question) return "-";
    const answer = question.answer.find((ans) => ans.key === "en")?.answer;
    return answer === "I have not connected with a BOL CHW before" ? "No" : "Yes";
}
