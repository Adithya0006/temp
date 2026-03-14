// import { TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Typography } from "antd";
import axios from "axios";
import {
    Box, Card, Table, TableBody, TableCell, TableHead, TableRow,
    Paper, Snackbar, Alert, AppBar, Toolbar, IconButton, Container, Avatar,
    CardActionArea, Grid, Chip, Tabs, Tab, Dialog, DialogTitle, DialogContent,
    Stack, TableContainer, TablePagination, Button, Badge,
    Divider, TextField
  } from "@mui/material";
import React, { useEffect, useState } from "react";
// import { userMessage } from "react-chatbot-kit/build/src/components/Chat/chatUtils";
import { useSelector } from "react-redux";
export default function ManageMrls(){

    const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails)

  

  var API1 = "/getactionrequiredmrl"
//   var API3="/supervisor/typepcbdetails"
  var fetchmrldata = "http://192.168.0.20:8000" + API1
//   var fetachTypePcbDetails="http://192.168.0.20:2000" + API3
//   var API2 = "/supervisor/assign"

//   var fetchAssignedPCB = "http://192.168.0.20:2000" + API1
if (configDetails?.project?.[0]?.ServerIP?.[0]?.PythonServerIP) {
    fetchmrldata = configDetails.project[0].ServerIP[0].PythonServerIP + API1;
    // opdashboard=configDetails.project[0].ServerIP[0].PythonServerIP + API1;
  }
  let user = JSON.parse(localStorage.getItem("user"));
  // console.log("fetchmrl: ",fetchmrldata,user)

    const [data,setData]=useState(null);
    const [load,setload]=useState(false)

    useEffect(()=>{
        const fetchmrl= async ()=>{
            try{
                // console.log("am inside")
                const mrldata = await axios.get(fetchmrldata, {  params: { staff_no: user.id } });
                setData(mrldata?.data)
                setload(true)
                // console.log("mrldata: ",mrldata)
            }
            catch(e){
                // console.log(e)
            }
        }
        fetchmrl()
    },[])
    return(
    <>
    

    <TableContainer >
        <Table size="small" variant="outlined" sx={{ borderRadius: 3, mt: 3, maxHeight: 650, overflowY: 'auto' }}>

            <TableHead>

            <TableRow>
             
                <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>Staff Number</TableCell>
                <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>Name</TableCell>
                <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>MRL</TableCell>
                <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>Initial</TableCell>
                <TableCell sx={{ bgcolor: '#f8f9fa', fontWeight: 'bold' ,fontSize:"1.15rem"}}>Expiry Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

            {/* {console.log("data: ", data)} */}
              {load &&  (
                data.map((item,index) => (
                  
                  <TableRow key={index}>
                
                    <TableCell sx={{opacity:0.8,fontWeight:600}}>{item.staff_no}</TableCell>
                    <TableCell sx={{opacity:0.8,fontWeight:600}}>{item.name}</TableCell>
                    <TableCell sx={{opacity:0.8,fontWeight:600}}>{item.ope_mrl}</TableCell>
                    <TableCell sx={{opacity:0.8,fontWeight:600}}>{item.initial}</TableCell>
                    <TableCell sx={{opacity:0.8,fontWeight:600}}>{item.ope_exp}</TableCell>
                  </TableRow>
                ))
              ) }
              {load === false && (
                <Typography>Data not Avialable</Typography>
              )}



            </TableBody>
        </Table>
    </TableContainer>

        
    </>
    )
}