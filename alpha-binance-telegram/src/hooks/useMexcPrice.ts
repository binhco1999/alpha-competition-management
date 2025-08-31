import { useState, useCallback, useRef, useEffect } from 'react';

export const useMexcPrice = (symbol: string) => {
    const [price, setPrice] = useState<number | null>(null);
    const [changeRate, setChangeRate] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const retryCountRef = useRef(0);
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second base delay

    const fetchPrice = useCallback(async (isRetry = false) => {
        // If this is not a retry, add a small delay to stagger requests
        if (!isRetry) {
            // Add a small random delay (0-500ms) to prevent all requests hitting the API at once
            const staggerDelay = Math.random() * 500;
            await new Promise(resolve => setTimeout(resolve, staggerDelay));
        }

        setLoading(true);
        setError('');

        try {
            const pair = symbol.toUpperCase() + "_USDT";
            const url = `/open/api/v2/market/ticker?symbol=${pair}`;

            // Add timeout to prevent hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(url, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data.code && data.code !== 200) {
                throw new Error(`API Error: ${data.msg || `code ${data.code}`}`);
            }

            if (data?.data?.[0]?.last) {
                const parsedPrice = parseFloat(data.data[0].last);
                const parsedChangeRate = parseFloat(data.data[0].change_rate);

                if (Number.isFinite(parsedPrice)) {
                    setPrice(parsedPrice);
                    setChangeRate(Number.isFinite(parsedChangeRate) ? parsedChangeRate : null);
                    retryCountRef.current = 0; // Reset retry count on success
                } else {
                    throw new Error(`Invalid price for ${symbol.toUpperCase()}`);
                }
            } else {
                throw new Error(`Price not found for ${symbol.toUpperCase()}`);
            }
        } catch (err: any) {
            const errorMessage = err.name === 'AbortError' ? 'Request timeout' : err.message;
            setError(errorMessage);

            // Implement retry logic with exponential backoff
            if (retryCountRef.current < maxRetries && !isRetry) {
                retryCountRef.current++;
                const delay = baseDelay * Math.pow(2, retryCountRef.current - 1); // Exponential backoff

                console.log(`Retrying price fetch for ${symbol} in ${delay}ms (attempt ${retryCountRef.current}/${maxRetries})`);

                setTimeout(() => {
                    fetchPrice(true); // Retry with isRetry flag
                }, delay);
            } else {
                // Final failure, reset retry count
                retryCountRef.current = 0;
                setPrice(null);
                setChangeRate(null);
            }
        } finally {
            setLoading(false);
        }
    }, [symbol]);

    // Cleanup function to reset retry count when component unmounts
    useEffect(() => {
        return () => {
            retryCountRef.current = 0;
        };
    }, []);

    return { price, changeRate, loading, error, fetchPrice };
}; 