import React from "react";
import Login from "./Login"
import Header from "./Header";
import Footer from "./Footer"
import Submit from "./Submit";
import { Routes,Route } from "react-router-dom";

function App(){
    return(
        <div>
        {/* Separating the code into simplier react components and mentioning the route so that when user 
        clicks the submit button it renders to other page */}
            <Header/>
            <Routes>
                <Route path="/" element={<Login/>}></Route>
                <Route path="Submit" element={<Submit/>}></Route>
            </Routes>
            <Footer/>
        </div>
    )
}

export default App ;