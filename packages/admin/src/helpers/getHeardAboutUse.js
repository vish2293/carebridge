export const getHeardAboutUse = (profileQuestion) => {
    if (!profileQuestion) return "-";

    const question = profileQuestion.find((q) =>
        q?.question?.questionML?.some(
            (ml) =>
                ml.key === "en" &&
                ml.value ===
                "How did you hear about us?"
        )
    );

    if (!question) return "-";
    const answer = question.answer.find((ans) => ans.key === "en")?.answer;
    return answer;
} 