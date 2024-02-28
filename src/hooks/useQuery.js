import { useQuery } from "@tanstack/react-query";
import { Api } from "../api/api";


export const UseQuery = (key, Url, enable = true, stale = 0) => {
    const { data, error, isLoading, isError, refetch, status } = useQuery(
        [key],
        () => {
            return Api.get(Url)
        },
        {
            enabled: enable,
            select: (res) => res.data,
            refetchOnMount: true,
            staleTime: stale,
            retry: 2
        })
    return {
        data,
        error,
        isLoading,
        isError,
        refetch,
        status
    }
}

