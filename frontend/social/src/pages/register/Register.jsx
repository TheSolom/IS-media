import { useState } from 'react';
import { Link } from 'react-router-dom';
import './register.scss';
import axios from 'axios';

const Register = () => {
    const [inputs, setInputs] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthDate: '',
        gender: '',
    });
    const [err, setErr] = useState(null);

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();

        try {
            console.log(inputs);
            await axios.post(
                'http://localhost:5000/api/v1/auth/signup',
                inputs,
            );
        } catch (err) {
            setErr(err.response.data);
        }
    };

    // console.log(err);

    return (
        <div className="register">
            <div className="card">
                <div className="left">
                    <h1>IS Media.</h1>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Libero cum, alias totam numquam ipsa exercitationem
                        dignissimos, error nam, consequatur.
                    </p>
                    <span>Do you have an account?</span>
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                </div>
                <div className="right">
                    <h1>Register</h1>
                    <form>
                        <input
                            type="text"
                            placeholder="firstname"
                            name="firstname"
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            placeholder="lastname"
                            name="lastname"
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            onChange={handleChange}
                        />
                        <label>
                            Birth date :
                            <input
                                type="text"
                                placeholder="yyyy-mm-dd"
                                name="birthDate"
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Gender :
                            <select name="gender" onChange={handleChange}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </label>
                        {err && err}
                        <button onClick={handleClick}>Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
