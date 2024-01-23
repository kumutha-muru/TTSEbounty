import React, {useEffect} from 'react';
import useGetModule from "../react-query/useGetModule";

export const useGetAllModules = () => {
    const {data, refetch, isLoading} = useGetModule()
    useEffect(() => {
        refetch()
    }, []);

    return {data,isLoading};
};