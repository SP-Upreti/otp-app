import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Verification() {
    const [code, setCode] = useState({
        inp1: "",
        inp2: "",
        inp3: "",
        inp4: "",
        inp5: "",
        inp6: ""
    });
    const [otp, setOtp] = useState(null);
    const [err, setErr] = useState(false);
    const [load, setLoad] = useState(false);
    const [modal, setModal] = useState(false);

    const inpRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ];

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (value.length <= 1) {
            setCode((prevCode) => ({
                ...prevCode,
                [name]: value
            }));

            const currentIndex = parseInt(name.replace('inp', '')) - 1;
            if (value && currentIndex < inpRefs.length - 1) {
                inpRefs[currentIndex + 1].current.focus();
            }
        }
    };

    // Handle the paste event
    const handlePaste = (e) => {
        const pastedData = e.clipboardData.getData("Text");
        if (/^\d{6}$/.test(pastedData)) {
            const splitCode = pastedData.split("");
            const newCode = {
                inp1: splitCode[0],
                inp2: splitCode[1],
                inp3: splitCode[2],
                inp4: splitCode[3],
                inp5: splitCode[4],
                inp6: splitCode[5],
            };
            setCode(newCode);
            inpRefs[5].current.focus(); // Focus on the last input after pasting
        }
    };

    const fetchApi = async () => {
        try {
            const url = "https://otpverificationapp.vercel.app/authenticate";
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("Fetched OTP:", data.code);
            setOtp(data.code);
        } catch (error) {
            console.error("Error fetching OTP:", error);
            toast.error("Error fetching OTP");
            setErr(true);
        }
    };

    const verifycode = async (code) => {
        try {
            const response = await fetch("https://otpverificationapp.vercel.app//verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log("Verification result:", result);

            if (result.success) {
                navigate('/welcome');
            } else {
                setErr(true);
                toast.error("Invalid OTP");
                setLoad(false)
                setCode({
                    inp1: "",
                    inp2: "",
                    inp3: "",
                    inp4: "",
                    inp5: "",
                    inp6: ""
                });
                inpRefs[0].current.focus();
            }
        } catch (error) {
            console.error("Error verifying code:", error);
            setErr(true);
            toast.error("Invalid OTP");
            setLoad(false);
            setCode({
                inp1: "",
                inp2: "",
                inp3: "",
                inp4: "",
                inp5: "",
                inp6: ""
            });
            inpRefs[0].current.focus();
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    const verify = (inputCode) => {
        if (otp !== null) {
            console.log("OTP from API:", otp);
            console.log("Input code:", inputCode);
            verifycode(inputCode);
            setLoad(true);
        } else {
            console.log("OTP is still undefined");
            setLoad(false);
        }
    };

    const handleSubmit = () => {
        const inpData = Object.values(code);

        const allDigits = Object.values(inpData).join("");
        if (allDigits.endsWith("7")) {
            setErr(true);
            toast.error("Number cannot end with 7");
            return;
        }

        const allNumbers = inpData.every(data => /^[0-9]$/.test(data));

        if (!allNumbers) {
            setErr(true);
            toast.error("Code can only be numbers and cannot be empty");
            setLoad(false);
        } else {
            setErr(false);
            setLoad(true);
            verify(inpData.join(""));
        }
    };

    return (
        <div className="relative h-[80vh] lg:h-screen flex justify-center items-center " style={{ boxSizing: "border-box" }}>
            <ToastContainer />
            <form method="post" onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                <div className="flex flex-col items-center justify-center gap-4 border p-10 ">
                    <div className="text-2xl font-bold font-serif text-center">Enter The Code Below</div>
                    <div className="flex gap-4 items-center">
                        {Array.from({ length: 6 }).map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                name={`inp${index + 1}`}
                                value={code[`inp${index + 1}`]}
                                onChange={handleInputChange}
                                onPaste={index === 0 ? handlePaste : null}  // Attach handlePaste to the first input
                                ref={inpRefs[index]}
                                className={`border border-black h-[2rem] w-[2rem] px-1 text-center focus:text-white focus:outline-blue-500  focus:bg-blue-500`}
                                maxLength={1}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>
                    <div>
                        <button disabled={load} className="bg-blue-950 text-white px-4 py-1 text-lg rounded-md">
                            {load ? "Verifying..." : "Submit"}
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <p>didn't get OTP?</p>
                        <p className="font-semibold cursor-pointer text-blue-500" onClick={() => { setModal(true) }}>request OTP</p>
                    </div>
                </div>
            </form>
            {modal && (<Modal code={otp} onclick={() => { setModal(false) }} />)}
        </div>
    );
}

function Modal({ code, onclick }) {
    const [mail, setMail] = useState(null);
    const [load, setLoad] = useState(false);

    const sendOtp = async () => {
        setLoad(true);
        console.log(mail)
        try {
            const response = await fetch("https://otpverificationapp.vercel.app/sendMail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ receiver: mail })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (result.success) {
                toast.success("OTP sent");
                onclick();
            } else {
                toast.error("Failed to send OTP");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            toast.error("Please enter a valid email");
        }
    };

    return (
        <div className="absolute h-screen w-full flex justify-center items-center bg-black bg-opacity-75">
            <form action="" onSubmit={(e) => { e.preventDefault(); sendOtp(); }}>
                <div className=" bg-white w-[300px] p-4 ">
                    <div className="mb-2 text-lg font-semibold"><h2>Please enter your email to receive code.</h2></div>
                    <div className=""><input type="email" name="email" id="email" placeholder="example@gmail.com" value={mail} onChange={(e) => setMail(e.target.value)} className="border border-black px-2 rounded-sm text-lg" minLength={12} required /></div>
                    <div className="">
                        <button className="bg-blue-500 text-white px-4 my-4 text-lg rounded-sm">{load ? "sending.." : "confirm"}</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
