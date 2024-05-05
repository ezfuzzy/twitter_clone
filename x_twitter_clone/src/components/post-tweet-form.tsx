import { styled } from "styled-components";
import React, { useState } from "react";
import { collection, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../routes/firebase";
import { addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


const Form = styled.form` display: flex; flex-direction: column; gap: 10px;`;
const Textarea = styled.textarea` border: 2px solid white; padding: 20px; border-radius: 20px; font-size:16px; color:white; background-color:black; width:100%; height: 130px; resize:none; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; &::placeholder { font-size:16px; } &:focus { outline:none; border-color:#4f5bff}`;
const AttachFileBtn = styled.label` padding:10px 0px; color:#4f5bff; text-align:center; border-radius: 20px; border: 1px solid #4f5bff; font-size:14px; font-weight: 600; cursor: pointer; `;
const AttachFileInput = styled.input` display:none; `;
const SubmitBtn = styled.input` background-color: #4f5bff; color: white; border:none; padding:10px 0px; border-radius:20px; font-size: 16px; cursor:pointer; &:hover, &:active { opacity:0.8 }`;

export default function PostTweetForm() {
    const [isLoading, setLoading] = useState(false);
    const [tweet, setTweet] = useState("");
    const [file, setFile] = useState<File | null>(null);
    // const [error, setError] = useState("");
    
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    };
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length === 1) {
            setFile(files[0]);
        }
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user || isLoading || tweet === "" || tweet.length > 180) return;
        
        try {
            setLoading(true);
            const doc = await addDoc(collection(db, "tweets"), {
                tweet,
                createdAt: Date.now(),
                username: user.displayName || "Anonymous",
                // check auth layer if want to delete
                userId: user.uid, 
            }); 
            if (file) {
                const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
                const result = await uploadBytes(locationRef, file);
                const url = await getDownloadURL(result.ref);
                await updateDoc(doc, {
                    photo: url,
                })
            }
            setTweet("");
            setFile(null);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }

    };
    return (
        <Form onSubmit={onSubmit}>
            <Textarea required rows={5} maxLength={180} onChange={onChange} value={tweet} placeholder="What is happening?" />
            {/* tweet stored in db, tweet img stored in storage (firebase)*/}
            <AttachFileBtn htmlFor="file">{file ? "Photo added ✔️" : "Add photo"}</AttachFileBtn>
            <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*" />
            {/* image/* : regardleff of extension*/}
            {/* 파일 유형에 대한 검증은 file객체 내부의 fileType을 이용해서 별도로 검증 처리가 필요
                ex) event.target.files[0].type === "image/png" */}
            <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post Tweet"} />
        </Form>
    )
}