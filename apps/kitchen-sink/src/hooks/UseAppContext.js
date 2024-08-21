import { useState, useEffect } from "react";
import mondaySdk from "monday-sdk-js";
import {isMatch} from "lodash"

const monday = mondaySdk();

export function useAppContext() {
    const [appContext, setAppContext] = useState({});

    useEffect(() => {
        const unsubscribe = monday.listen('context', (contextEvent) => {
            setAppContext((previousContext) =>
                isMatch(previousContext, contextEvent) ? previousContext : contextEvent
            );
        })
        return () => {
            unsubscribe();
        }
    }, [])
    
    return appContext;
}