import { useCallback, useEffect, useState } from "react";
import { clickEffect } from "..";

interface RoomProps {
    text: string;
  }
export const OneCharAtATimeDiv = (props: RoomProps) => {
    const {text} = props;
    const [index, setIndex] = useState(0);

    const incrementIndex = useCallback(()=>{
        if(index < text.length){
            setTimeout(()=>{
                clickEffect();
                window.requestAnimationFrame(()=>{setIndex(index +1)})}, 50)
        }

    },[index, text, setIndex]);

    useEffect(()=>{
        incrementIndex();
    },[index,incrementIndex]);

    useEffect(()=>{
        setIndex(0);
    },[text]);

    return(
        <div>
            {text.substr(0, index)}
        </div>
    )


}