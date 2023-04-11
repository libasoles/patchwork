import { isMobile } from 'react-device-detect';
import { useEffect, useState } from "react";

const useIsMobile = () => {
    const [mobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(isMobile)
    }, [])

    return { isMobile: mobile }
}

export default useIsMobile