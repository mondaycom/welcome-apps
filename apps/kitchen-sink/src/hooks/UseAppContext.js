import { useState, useEffect } from "react";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

export function useAppContext() {
    const { context, setContext } = useState({});

    useEffect(() => {
        monday.listen('context', (contextEvent) => {
            console.log('Updating context');
            setContext(contextEvent);
        })
    }, [setContext])
    
    return context;
}