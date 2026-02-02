// import { Button, Typography } from "@mui/material";
// import React, { useState } from "react";

// export default function Chatgpt(){
//     const [ctn,setctn]=useState([]);
//     const [val,setval]=useState(0);

//     function clickhandler(){
//         setctn(prev=>[
//             ...prev,
//             {id:prev.length,count:0}
//         ])
//     }
//     function handlecount(e){
//         setctn(prev =>
//   prev.map(item =>
//     item.id === id
//       ? { ...item, count: item.count + 1 }
//       : item
//   ))
//     }
//     return(

//         <>
//             <Button variant="contained" onClick={clickhandler}>Add counter</Button>

//             <Typography><Button onClick={handlecount}>+</Button>:{val}</Typography>
//         </>
//     )
// }




// import { Button, TextField, Typography } from "@mui/material";
// import React, { useState } from "react";

// export default function Chatgpt(){

//     const [tempname,settempname]=useState("");
//     const [names,setnames]=useState([]);

//     function handletyping(e){
//         settempname(e.target.value);
//     }

//     function clickhandler(){
//         setnames(prev=>[
//             ...prev,{
//                 id:prev.length,name:tempname
//             }
//         ])
//         settempname("")
//     }


//     function handledel(id){
//         setnames(prev=>
//             prev.filter(item => item.id !== id)
//         )
//     }

//     return(
//         < >
//             <TextField label="add name" onChange={handletyping} value={tempname}></TextField>
//             <Button onClick={clickhandler}>Add </Button>

//             {names.map((name)=>(
//                 <>
//                 <Typography>{name.name}</Typography>
//                 <Button onClick={()=>{handledel(name.id)}} key={name.id}>Delete</Button>
//                 </>
//             ))}

//         </>
        
//     )
// }














import React, { useState } from "react";

export default function Practice3() {
  const [tasks, setTasks] = useState([]);

  function addTask() {
    // add new task
    setTasks(
        prev=>[
            ...prev,{id:prev.length+1,text:"Task"}
        ]
    )
  }

  function toggleTask(id) {
    // toggle done for only one task
  }

  return (
    <>
      <button onClick={addTask}>Add Task</button>

      {tasks.map(task => (
        <div key={task.id}>
          <span>
            {task.id}:{task.text}
          </span>

          <button onClick={() => toggleTask(task.id)}>
            Toggle
          </button>
        </div>
      ))}
    </>
  );
}
