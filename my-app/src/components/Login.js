import React from "react"
import {useNavigate} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function Login(){
    const navigate = useNavigate();
    //Use state is used when the variables get constantly updated.Initially we can specify an empty value or any default one.
    const [value,setChange]=React.useState({
        email : "",
        location : "",
        job : "",
        time : "00:00",
        day : "sunday"
    });
    //When the user enters the input, this function gets triggered and updates it wil the current value.
    function changeValue(event){
        const{name,value}=event.target
        setChange((prevValue)=>{
            return{
                ...prevValue,
                [name]:value
            }
        })
        
        
    }

//When the button is clicked this function gets triggered, and if no errors it navigates to the submit page
async function handleClick()
{

    if (value.email==="" || value.location ==="" || value.job==="" || value.time===""){
            toast.error("Fill all the details", {
                theme:"colored",
                autoClose:1000,
                position: "top-center",
                draggable:true,
                pauseOnHover:true,
            }
        )
    }
    else{
            navigate("Submit")
    }
    //Sending all the frontend inputs to the backened with the help of axios
    try{
        await axios.post("http://localhost:4000/post_name",{
            e : value.email,
            l : value.location,
            j : value.job,
            t : value.time,
            d : value.day
        })
    } catch(error){
        console.log(error)
    }
    
}
    return(
        // All the inputs given to the user are written below
        <div className="login">
            <form>
                <input 
                    placeholder="Email address"
                    name = "email"
                    type= "email"
                    value={value.email}
                    onChange={changeValue}
                    />
                <input 
                    placeholder="Location"
                    name = "location"
                    value={value.location}
                    onChange={changeValue}
                    />
                <input 
                    placeholder="Job role"
                    name = "job"
                    value={value.job}
                    onChange={changeValue}
                    />
                <div className="automation">
                    <label>Scheduling cycle</label>
                    <br/>
                    <select className="time" 
                        name = "day"
                        value={value.day}
                        onChange={changeValue}>
                        <option id="0" value="sunday">Sunday</option>
                        <option id="1" value="monday">Monday</option>
                        <option id="2" value="tuesday">Tuesday</option>
                        <option id="3" value="wednesday">Wednesday</option>
                        <option id="4" value="thursday">Thursday</option>
                        <option id="5" value="friday">Friday</option>
                        <option id="6" value="saturday">Saturday</option>
                    </select>
                    <br/>
                    <input className="time"
                        type="time"
                        name = "time"
                        value={value.time}
                        onChange={changeValue}
                        />
                </div>
            </form>
            <button onClick={handleClick}>Submit</button>
            <ToastContainer />
        </div>
    )
}
export default Login;