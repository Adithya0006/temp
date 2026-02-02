import { Typography } from "@mui/material";
import React from "react";

export default function Temp({props,T3}){
    console.log("least child called!")
    T3(100000);
    console.log("props rec: ",props)
    return(
        <>
            {props?.map((item,i)=>(
                <Typography key={i}>{item}</Typography>
            ))}
        </>
    )
}