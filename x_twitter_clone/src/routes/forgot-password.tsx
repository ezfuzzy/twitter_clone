import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Link
import { auth } from "./firebase"
import { FirebaseError } from "firebase/app";
//import { signInWithEmailAndPassword } from "firebase/auth";
//import { auth } from "./firebase";
import {
  Error,
  Input,
  //Link, 
  Title,
  Wrapper,
  Form,
} from "../components/auth-components";
// import GithubButton from "../components/github-btn";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = e;
    name === "email" ? setEmail(value) : undefined;
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "") return;
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
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
  };
  return (
    <Wrapper>
      <Title>Reset your password</Title>
      <Form onSubmit={onSubmit}>
        <Input onChange={onChange} name="email" value={email} placeholder="Email" type="email" required />
        {/* captcha */}
        <Input type="submit" value={isLoading ? "Loading......" : "Send password reset email"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
    </Wrapper>
  );
}

