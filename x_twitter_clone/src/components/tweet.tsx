// import { useState } from "react";
import { auth, db, storage } from "../routes/firebase";
import { ITweet } from "./timeline";
import { styled } from "styled-components";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React from "react";
// import { useState } from "react";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
    
`;

const Column = styled.div`

`;

const Username = styled.span`
    font-weight: 600;
    font-size: 15px;

`;

const Photo = styled.img`
    height: 100px;
    width: 100px;
    border-radius: 15px;
`;

const Payload = styled.p`
    margin: 10px 0px;
    font-size: 18px;
`;

const DeleteBtn = styled.button`
    background-color: tomato;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;
const EditBtn = styled.button`
    background-color: #84ff84;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    margin-left: 10px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;


export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
    // const [isLoading, setLoading] = useState(false);
    const user = auth.currentUser;

    // const [isLoading, setLoading] = useState(false);
    const onDelete = async () => {
        // setLoading(true);
        const deleteOk = confirm("Are you sure you want to delete this tweet? cant recover.");
        if (!deleteOk || user?.uid !== userId) return;
        try {
            // setLoading(true);
            await deleteDoc(doc(db, "tweets", id));
            if (photo) {
                const photoREf = ref(storage, `tweets/${userId}/${id}`)
                await deleteObject(photoREf);
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setLoading(false);
        }
    }
    const onEdit = async () => {        
      // editBtn 
      if (user?.uid !== userId) return;
      try {
        const result = prompt('want to change')

        const docRef = doc(db, "tweets", id);
        await updateDoc(docRef, {
          tweet: result,
          
        })
        // const doc = await updateDoc()
          // setLoading(true);
          // const doc =  await 
          /*
          awaut updateDoc(doc, {
              // data
              data: 
          })
          */
          if(photo) {
              //await change obj ? 
          }
      } catch (e) {
          console.log(e);
      } finally {
          // setLoading(false);
      }
    }

    return (
        <Wrapper>
            <Column>
                <Username>{username}</Username>
                <Payload>{tweet}</Payload>
                {user?.uid === userId ? <DeleteBtn onClick={onDelete}>Delete</DeleteBtn> : null}
                {/* {user?.uid === userId ? <EditBtn onClick={onEdit} value={isLoading ? "Edit..." : "Edit"} /> : null} */}
                {user?.uid === userId ? <EditBtn onClick={onEdit}>Edit</EditBtn> : null}
            </Column>
            <Column>
            {photo ? <Photo src={photo} /> : null}
            </Column>
        </Wrapper>
    )
}