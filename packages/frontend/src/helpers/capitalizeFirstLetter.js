export const capitalizeFirstLetter = (string) => {
    if (string) {
        const arr = string?.split(' ');
        for (let i = 0; i < arr?.length; i++) {
            arr[i] = arr[i][0] && arr[i][0].toUpperCase() + arr[i].substr(1);
        }
        const str2 = arr.join(' ');
        return str2;
    }
    return '';
};