import { writable, type Writable } from "svelte/store";

export const nameData: Writable<[{ name: string; tally: number }]> = writable([{
    name: "",
    tally: 0
}]);

export const addToNameData = (name: string, tally: number) => {
    nameData.update((nameData) => {
        nameData.push({ name, tally });
        return nameData;
    });
}