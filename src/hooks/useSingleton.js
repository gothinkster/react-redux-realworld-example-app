import agent from "../agent";
import {useState} from "react";

const useSingleton = (callBack = () => {}) => {
    const [hasBeenCalled, setHasBeenCalled] = useState(false);
    if (hasBeenCalled) return;
    callBack();
    setHasBeenCalled(true);
}

export default useSingleton;