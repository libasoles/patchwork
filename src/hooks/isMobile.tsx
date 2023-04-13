import { isMobile } from 'react-device-detect';
import { useEffect, useState } from "react";

const useIsMobile = () => {
    const [mobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(isMobile)
    }, []) // TODO: listen to window width changes

    return { isMobile: mobile }
}

export default useIsMobile