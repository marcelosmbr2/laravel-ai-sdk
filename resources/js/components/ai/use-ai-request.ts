import { useCallback, useState } from 'react';

/**
 * Read the CSRF token that Laravel stores in the `XSRF-TOKEN` cookie so it can
 * be echoed back in the `X-XSRF-TOKEN` header for stateful POST requests.
 */
function readXsrfToken(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);

    return match ? decodeURIComponent(match[1]) : '';
}

export type AiRequestState<T> = {
    data: T | null;
    error: string | null;
    processing: boolean;
};

export type UseAiRequestReturn<T> = AiRequestState<T> & {
    run: (formData: FormData) => Promise<T | null>;
    reset: () => void;
};

/**
 * Minimal hook for the AI Lab playground: POSTs a `FormData` payload to one of
 * the `/ai/*` JSON endpoints and exposes the `{ data, error, processing }`
 * lifecycle. Backend validation and provider errors are surfaced as `error`.
 */
export function useAiRequest<T = unknown>(url: string): UseAiRequestReturn<T> {
    const [state, setState] = useState<AiRequestState<T>>({
        data: null,
        error: null,
        processing: false,
    });

    const run = useCallback(
        async (formData: FormData): Promise<T | null> => {
            setState({ data: null, error: null, processing: true });

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData,
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-XSRF-TOKEN': readXsrfToken(),
                    },
                });

                const payload = await response.json().catch(() => ({}));

                if (!response.ok) {
                    const message =
                        payload?.error ??
                        payload?.message ??
                        'Ocorreu um erro inesperado ao processar a requisição.';

                    setState({ data: null, error: message, processing: false });

                    return null;
                }

                setState({
                    data: payload as T,
                    error: null,
                    processing: false,
                });

                return payload as T;
            } catch {
                setState({
                    data: null,
                    error: 'Não foi possível conectar ao servidor. Tente novamente.',
                    processing: false,
                });

                return null;
            }
        },
        [url],
    );

    const reset = useCallback(
        () => setState({ data: null, error: null, processing: false }),
        [],
    );

    return { ...state, run, reset };
}
