import React, { useCallback, useEffect, useState } from 'react';

function useAsync<T, E = string>(
  asyncFunction: (...args: Array<any>) => Promise<T>,
  {
    args,
    immediate = true,
    initialData,
  }: { args?: Array<any>; immediate?: boolean; initialData?: T },
) {
  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle');
  const [data, setData] = useState<T | null>(initialData || null);
  const [error, setError] = useState<E | null>();

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(
    (...args: Array<any>) => {
      setStatus('pending');
      setData(null);
      setError(null);

      return asyncFunction(...args)
        .then((response: any) => {
          setData(response);
          setStatus('success');
        })
        .catch((error: any) => {
          setError(error);
          setStatus('error');
        });
    },
    [asyncFunction],
  );

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediate) {
      args ? execute(...args) : execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
}

export default useAsync;
