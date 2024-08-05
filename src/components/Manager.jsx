import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from "uuid";
// toastify css
import 'react-toastify/dist/ReactToastify.css'


const Manager = () => {
    const eyeRef = useRef();
    const passwordRef = useRef();
    const [form, setForm] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([]);

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        setPasswordArray(passwords)
    }

    useEffect(() => {
        getPasswords()
    }, [])

    const copyText = (text) => {
        toast('Copied to clipboard', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        navigator.clipboard.writeText(text);
    }



    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            const newEntry = { ...form, id: uuidv4() };
            // if any password exists with the id,simply delete it
            await fetch("http://localhost:3000/", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: form.id })
            })
            setPasswordArray([...passwordArray, newEntry]);
            // save to server
            await fetch("http://localhost:3000/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...form, id: uuidv4() })
            })
            // localStorage.setItem("passwords", JSON.stringify([...passwordArray, newEntry]));
            setForm({ site: "", username: "", password: "" });
            toast('Password Saved', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                // transition: "Bounce",
            });
        }
        else {
            toast('Password not Saved', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                // transition: "Bounce",
            });
        }
    }
    const deletePassword = async (id) => {
        let c = confirm("Do you really want to delete this password?")
        if (c) {
            setPasswordArray(passwordArray.filter(item => item.id !== id))
            // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item => item.id !== id)))
            let res = await fetch("http://localhost:3000/", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            })
            toast('Password deleted', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                // transition: "Bounce",
            });
        }
    }
    const editPassword = (id) => {
        setForm({...passwordArray.filter(item => item.id === id)[0], id:id})
        setPasswordArray(passwordArray.filter(item => item.id !== id))
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }


    const toggleEyeButton = (e) => {
        if (eyeRef.current.src.includes("icons/eyecross.png")) {
            eyeRef.current.src = "icons/eye.png"
            passwordRef.current.type = "password"
        }
        else {
            passwordRef.current.type = "text"
            eyeRef.current.src = "icons/eyecross.png";
        }
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            // transition="Bounce"
            />
            <div className=" p-2 md:p-0 max-w-4xl mx-auto min-h-[93vh] pb-0">
                <h1 className='font-bold text-center text-3xl'>Pass<span className='text-green-600'>Vault</span> </h1>
                <p className='text-center'>Protect your digital life with ease</p>
                <div className='flex flex-col p-4 text-black gap-3 items-center'>
                    {/* // site input */}
                    <input id='site' onChange={handleChange} value={form.site} placeholder='Enter website Name/URL' type="text" name='site' className='bg-white w-full border border-green-500 rounded-full px-4 py-1' />
                    <div className='flex flex-col md:flex-row gap-3 justify-between w-full'>
                        {/* username input */}
                        <input id='username' onChange={handleChange} value={form.username} placeholder='Enter Username' type="text" name='username' className='bg-white w-full border border-green-500 rounded-full px-4 py-1' />
                        <div className="relative">
                            {/* password input */}
                            <input id='password' ref={passwordRef} onChange={handleChange} value={form.password} placeholder='Enter Password' type="password" name='password' className='bg-white w-full border border-green-500 rounded-full px-4 py-1' />
                            <div className="show absolute right-[3px] top-[4px] cursor-pointer" onClick={toggleEyeButton}>
                                <img ref={eyeRef} className='p-1' width={26} src="icons/eye.png" alt="eye" />
                            </div>
                        </div>
                    </div>
                    <button onClick={savePassword} className='flex justify-center items-center gap-2 bg-green-400 rounded-full px-8 py-2 w-fit hover:bg-green-300 text-sm border border-green-900'> <lord-icon
                        src="https://cdn.lordicon.com/jgnvfzqg.json"
                        trigger="hover"
                        style={{ "width": "25px", "height": "25px" }}>
                    </lord-icon>Save Password</button>
                </div>
                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
                    {passwordArray.length === 0 ? <div className='text-center'>No passwords Saved Yet</div> :
                        <table className="table-auto mb-10 w-full rounded-lg overflow-hidden">
                            <thead className=' bg-green-800 text-white  '>


                                <tr>
                                    <th className="py-2" >Site</th>
                                    <th className="py-2" >Username</th>
                                    <th className="py-2" >Password</th>
                                    <th className="py-2" >Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-green-100'>
                                {passwordArray.map((item, index) => {
                                    return <tr key={index}>
                                        {/* site */}
                                        <td className='py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center '>
                                                <a href={item.site} target='_blank'>{item.site}</a>
                                                <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.site) }}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover" >
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        {/* username */}
                                        <td className='py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center '>
                                                <span>{item.username}</span>
                                                <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.username) }}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover" >
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        {/* password */}
                                        <td className='py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center '>
                                                <span>{"*".repeat(item.password.length)}</span>
                                                <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.password) }}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover" >
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        {/* actions */}
                                        <td className='justify-center py-2 border border-white text-center'>
                                            {/* edit */}
                                            <span className='cursor-pointer mx-1' onClick={() => { editPassword(item.id) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/gwlusjdu.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>
                                            {/* delete */}
                                            <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/skkahier.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>
                                        </td>
                                    </tr>

                                })}

                            </tbody>
                        </table>
                    }
                </div>
            </div >
        </>
    )
}

export default Manager
