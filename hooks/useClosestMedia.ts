import { useEffect, useState } from "react";
import { Dimensions } from "react-native";


type ValueOf<T> = T[keyof T];
const sizes = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
};

function isMatch(media: keyof typeof sizes) {
    const dim = Dimensions.get('window').width;
    const mediaNum = parseInt(sizes[media], 10)
    return dim > mediaNum
    // const query = `(min-width: ${sizes[media]})`;
    // return window.matchMedia(query).matches;
}

function findClosest(queries: (keyof typeof sizes)[]) {
    for (let i = queries.length - 1; i >= 0; i--) {
        if (isMatch(queries[i])) {
            return queries[i];
        }
    }
    return 'sm';
}

export const useClosestMedia = () => {
    const [closest, setClosest] = useState('sm');

    useEffect(() => {
        const listener = () => setClosest(findClosest(
            Object.keys(sizes) as (keyof typeof sizes)[]
        ));
        listener();


        Dimensions.addEventListener("change", listener);
        // return () => Dimensions.removeEventListener('resize', listener); //Cleanup
        // window.addEventListener('resize', listener);
        // return () => window.removeEventListener('resize', listener); //Cleanup
    }, []);

    return closest;
};