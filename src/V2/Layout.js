import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import Temp from "./Temp";

export default function Layout({T2}){
    const [task,settask]=useState("");
    const [dta,setdta]=useState([]);
    function handlechange(e){
        settask(e.target.value)
    }

    function uji(buffer2){
        console.log("buf 2 called: ",buffer2);
        T2(buffer2);

    }

    function handleclick(e){
        setdta(prev=>[
            ...prev,task
        ])

        settask("");

    }

    return(

        <>
            <Box sx={{width:"fit-content",border:"2px solid balck",height:"fit-content",m:3}}>
                <TextField label="task" value={task} onChange={handlechange}></TextField>
            </Box>
            <Button variant="contained" onClick={handleclick}>Add</Button>
            <Temp data={dta} T3={uji}/>
        </>
    )
}