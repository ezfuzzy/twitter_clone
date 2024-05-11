import { auth, db, storage } from "../routes/firebase";
import { ITweet } from "./timeline";
import { styled } from "styled-components";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

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

const LikeBtn = styled.label`
  cursor: pointer;
  /* margin-right: 10px; */
  margin-right: 10px;
  svg {
    width: 20px;
  }
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
  const user = auth.currentUser;
  const [isLiked, setIsLiked] = useState(false);
  const isLike = document.querySelector('#Like') as HTMLInputElement;
  
  const LikeUpDown = async () => {
    setIsLiked(!isLiked);
    
    if (isLiked) {
      isLike.style.color = 'blue';
    } else {
      isLike.style.color = 'red';
    }
  }

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
      const result = prompt('[edit tweet]')
      if (result) {
        const docRef = doc(db, "tweets", id);
        await updateDoc(docRef, {
          tweet: result,
        })
      }
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
        {/* 여기서 username이 real-time으로 수정 되어야함.  */}
        {/* 현재는 저장된 후 바뀌지 않는 구조 */}
        {/* tweet의 username에 접근할 수 있어야함. */}
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        <LikeBtn id="Like" htmlFor="Like00" onClick={LikeUpDown}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
          </svg>
        </LikeBtn>

        {user?.uid === userId ? <DeleteBtn onClick={onDelete}>Delete</DeleteBtn> : null}
        {user?.uid === userId ? <EditBtn onClick={onEdit}>Edit</EditBtn> : null}
      </Column>
      <Column>
      {photo ? <Photo src={photo} /> : null}
      </Column>
    </Wrapper>
  )
}