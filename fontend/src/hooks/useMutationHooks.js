import { useMutation } from "@tanstack/react-query"

export const useMutationhooks = (fnCallback) => {
    const mutation = useMutation({
        mutationFn: fnCallback
    })
    return mutation
}