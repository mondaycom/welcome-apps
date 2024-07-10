import { useState, useEffect } from "react";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

export function useAppContext() {
    const [appContext, setAppContext] = useState({});

    useEffect(() => {
        monday.listen('context', (contextEvent) => {
            console.log('Updating context');
            setAppContext(contextEvent);
        })
    }, [setAppContext])
    
    return appContext;
}