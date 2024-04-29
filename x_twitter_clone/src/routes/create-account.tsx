import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "./firebase"
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
    Error,
    Input,
    Switcher,
    Title,
    Wrapper,
    Form,
} from "../components/auth-components";
import GithubButton from "../components/github-btn";


export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPasssword] = useState("");
    const [error, setError] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        // const { name, value } = e.target;

        // console.log(e.target.value);
        name === "name" ? setName(value) : name === "email" ? setEmail(value) : setPasssword(value);
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || name === "" || email === "" || password === "") return;
        try {
            // create an account in real
            // set the username
            // redirect to home
            setLoading(true);
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            // console.log(credentials.user);
            await updateProfile(credentials.user, {
                displayName: name,
            });
            navigate("/");
        } catch (e) {
            // process error
            // when createUserWithEmailAndPassword fail
            // setError();
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
        
        
        console.log(name, email, password);
    };
    return (
        <Wrapper>
            <Title>Join X</Title>
            <Form onSubmit={onSubmit}>
                <Input onChange={onChange} name="name" value={name} placeholder="Name" type="text" required /> 
                <Input onChange={onChange} name="email" value={email} placeholder="Email" type="email" required />
                <Input onChange={onChange} name="password" value={password} placeholder="Password" type="password" required />
                <Input type="submit" value={isLoading ? "Loading......" : "Create Account"} />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                Already have an account?{" "}
                <Link to="/login">Go Login &rarr;</Link>
            </Switcher>
            <GithubButton />
        </Wrapper>
    );
}

