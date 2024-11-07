import { useState } from 'react';

const useUserContext = () => {
    const [context, setContext] = useState('');
    return {
        context: context,
        setContext: setContext
    }
}

export default useUserContext;