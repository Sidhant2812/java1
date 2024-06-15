/* React page for registering a new account */
import { useState, useRef } from "react";
import "./register.scss";
// import logo from "../../components/titan-clear-logo.png"; // Remove this line
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import RegexUtil from "../../utils/regex-util";
import ROUTES from "../../routes";

/**
 * Returns a react component consisting of the Register page. Includes all logic relevant to registering.
 * 
 * @returns a react component consisting of the Register page.
 */
export default function Register() {
    const ERROR_MESSAGES = {
        EXISTING_CREDENTIALS_ERROR: "Email, phone number, or username already taken.",
        INVALID_EMAIL_ERROR: "Invalid email format.",
        INVALID_PHONE_ERROR: "Invalid phone format.",
        INVALID_USERNAME_ERROR: "Invalid username. Username cannot contain spaces and minimum length must be at least ",
        INVALID_PASSWORD_ERROR: "Invalid password. The length must be at least ",
        GENERIC_SERVER_ERROR: "There was a problem registering your account. Please try again later.",
        DIDNT_AGREE_TERMS_ERROR: "You must agree to the terms and conditions before registering."
    }

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const [isValidCredentials, setIsValidCredentials] = useState(true);

    const [clickedGetStarted, setclickedGetStarted] = useState(false);

    const [errorMessage, setErrorMessage] = useState(ERROR_MESSAGES.EXISTING_CREDENTIALS_ERROR);

    const emailRef = useRef();

    const [showTerms, setShowTerms] = useState(false);

    const [termsAgreed, setTermsAgreed] = useState(false);

    const handleShowTerms = (e) => {
        e.preventDefault(); 

        if (e.key === 'Enter') {
            handleRegister(e);
        }

        setShowTerms(!showTerms);
    }

    const handleAgreeTerms = (e) => {
        setTermsAgreed(!termsAgreed);
    } 

    function isEmailBoxFilled() {
        return emailRef.current.value.length > 0;
    }

    const handleGetStarted = (e) => {
        e.preventDefault(); 

        if (clickedGetStarted) {
            handleRegister(e);
            return;
        }

        if (isEmailBoxFilled()) {
            setclickedGetStarted(true);
        }
    }

    const handleRegister = (e) => {
        e.preventDefault(); 

        setIsValidCredentials(true);

        if (!RegexUtil.isValidEmailFormat(email)) {
            setIsValidCredentials(false);
            setErrorMessage(ERROR_MESSAGES.INVALID_EMAIL_ERROR);
            return;
        }

        if (!RegexUtil.isValidPhoneFormat(phone)) {
            setIsValidCredentials(false);
            setErrorMessage(ERROR_MESSAGES.INVALID_PHONE_ERROR);
            return;
        }

        if (!RegexUtil.isValidUsernameFormat(username)) {
            setIsValidCredentials(false);
            setErrorMessage(ERROR_MESSAGES.INVALID_USERNAME_ERROR + RegexUtil.MIN_USERNAME_LENGTH + ".");
            return;
        }

        if (!RegexUtil.isValidPasswordFormat(password)) {
            setIsValidCredentials(false);
            setErrorMessage(ERROR_MESSAGES.INVALID_PASSWORD_ERROR + RegexUtil.MIN_PASSWORD_LENGTH + ".");
            return;
        }      

        if (!termsAgreed) {
            setIsValidCredentials(false);
            setErrorMessage(ERROR_MESSAGES.DIDNT_AGREE_TERMS_ERROR);
            return;
        }  
        
        performRegister();
    }

    const performRegister = async () => {
        try {
            await axios.post("auth/register", {
                username: username,
                email: email,
                phone: phone,
                password: password
            });

            navigate(ROUTES.LOGIN, {
                state: {
                    justRegistered: true
                }
            });
        } catch (err) {
            if (err.response && err.response.status === 403) {
                setErrorMessage(ERROR_MESSAGES.EXISTING_CREDENTIALS_ERROR);
            } else {
                console.log(err)
                setErrorMessage(ERROR_MESSAGES.GENERIC_SERVER_ERROR);
            }
            setIsValidCredentials(false);
        }
    }

    return (
        <div className="register">
            <div className="top">
                <div className="wrapper">
                    {/* <img className="logo" src={logo} alt="" /> */} {/* Remove or replace this */}
                    <Link to="/login" className="link">
                        <button className="loginButton">
                            Sign In
                        </button>
                    </Link>
                </div>
            </div>
            <div className="container" style={{ display: (showTerms) && "none" }}>
                <h1>Ready to level up your fitness and nutrition journey?</h1>
                <h2>Sign up for free.</h2>
                <p>
                    Create your account below.
                </p>

                <div className="input">
                    <input
                        type="email"
                        placeholder="email"
                        onChange={(e) => setEmail(e.target.value)}
                        ref={emailRef}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleGetStarted(e);
                            }
                        }}
                    />
                    {!clickedGetStarted && (
                        <button
                            className="registerButton"
                            onClick={handleGetStarted}
                        >Get Started</button>
                    )}
                </div>

                <div className="input" style={{ visibility: !clickedGetStarted && "hidden" }}>
                    <input
                        type="phone number"
                        placeholder="phone number"
                        onChange={(e) => setPhone(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGetStarted(e)}
                    />
                    <button onClick={handleRegister} style={{ visibility: "hidden" }}>Sign Up</button>
                </div>

                { 
                    <form className="input" style={{ visibility: !clickedGetStarted && "hidden" }}>
                        <input
                            type="username"
                            placeholder="username"
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRegister(e)}
                        />
                        <input
                            type="password"
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRegister(e)}
                        />
                        <button className="termsButton" onClick={handleShowTerms}>Terms and Conditions</button>
                    </form>
                }
                
                { 
                    <form className="input" style={{ visibility: !clickedGetStarted && "hidden" }}>
                        <button className="registerButton" onClick={handleRegister}>Sign Up</button>
                    </form>
                }

                {
                    <div className="errorMessage">
                        <p style={{ visibility: (isValidCredentials) && "hidden" }}>
                            {errorMessage}
                        </p>
                    </div>
                }
            </div>

            {
                <div className="termsForm" style={{ visibility: (!showTerms) && "hidden" }}>
                    <div className="termsContainer">
                        <form>
                            <h1>Terms and Conditions</h1>
                            <textarea readOnly value={"No terms and conditions currently..."} className="terms-textarea"></textarea>
                            <span className="checkboxContainer">
                                <input
                                    type="checkbox"
                                    checked={termsAgreed}
                                    onChange={handleAgreeTerms}
                                />
                                {"I have read and agreed to the terms and conditions."}
                            </span>
                            <button className="backButton" onClick={handleShowTerms}>Back</button>
                        </form>
                    </div>
                </div>
            }
        </div>
    )
}
