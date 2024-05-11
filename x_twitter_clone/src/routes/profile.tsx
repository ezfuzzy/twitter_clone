import React, { useEffect, useState } from "react";
import { auth, db, storage } from "./firebase";
import { styled } from "styled-components";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, limit, onSnapshot, orderBy, query, where, writeBatch } from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { Error } from "../components/auth-components";
import { Unsubscribe } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const ChangeAvatar = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1a1a1a;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;


const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;
const ChangeName = styled.label`
  cursor: pointer;
`;

const Name = styled.span`
  font-size: 22px;
`;
const NameInput = styled.input`
  display: none;
`;

const DeleteAccount = styled.button`
  width: 100px;
  height: 30px;
  background-color: tomato;
  color: white;
  font-weight: 600;
  /* padding: 10px 20px; */
  border: none;
  border-radius: 20px;
  margin-top: 20px;
  cursor: pointer;
`;

const Tweets = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [Avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [nickname, setNickname] = useState(user?.displayName);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const { files } = e.target;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatarImg/${user?.uid}`) // overwrite img
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      })
    }
  }

  const onNicknameChange = async () => {
    setError("");
    try {
      // const newNickname = prompt("Set nickname");
      const newNickname = prompt("Set nickname");
      setNickname(newNickname);
      // setNickname(prompt("Set nickname"));
      if (newNickname) { // if newNickname is not null or cancel the prompt.
        setNickname(newNickname);
        if (user) {
          await updateProfile(user, {
            displayName: newNickname,
          })
          // update all tweets's username to newnickname
          const tweetsRef = collection(db, "tweets");
          const userTweetsQuery = query(tweetsRef, where("userId", "==", user.uid));
          const userTweetsSnapshot = await getDocs(userTweetsQuery);
          const batch = writeBatch(db);
          
          userTweetsSnapshot.forEach((doc) => {
            const tweetRef = doc.ref;
            batch.update(tweetRef, { username: newNickname });
          });

          await batch.commit();
        }
      }
    } catch (e) {
      // setError(e.message);
    } finally {
      //setLoading(false);
    }
  }

  const deleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    
    if (confirmed) {
      try {
        // Delete all tweets by the user
        const tweetsRef = collection(db, "tweets");
        const userTweetsQuery = query(tweetsRef, where("userId", "==", user?.uid));
        const userTweetsSnapshot = await getDocs(userTweetsQuery);
        const batch = writeBatch(db);
      
        userTweetsSnapshot.forEach((doc) => {
          const tweetRef = doc.ref;
          batch.delete(tweetRef);
        });
        await batch.commit();
       
        await user?.delete();        
        // Sign out and redirect to login page
        await auth.signOut();
        navigate("/login");
      } catch (error) {
        // setError(error.message);
      }
    }
  }

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchTweets = async () => { // firebase is  vvvvvvvvery flexible
      const tweetsQuery = query( // say to firebase db about this query
        collection(db, "tweets"),
        where("userId", "==", user?.uid), // have to rule the index 
        orderBy("createdAt", "desc"),
        limit(25),
      );
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => { // map : make arr
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return { // > tweets object 
            tweet, createdAt, userId, username, photo,
            id: doc.id,
          };
        });
        setTweets(tweets);   
      });
      
      setTweets(tweets);
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <ChangeAvatar htmlFor="Avatar">
        {Avatar ? <AvatarImg src={Avatar} /> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" /></svg>}
      </ChangeAvatar>
      <AvatarInput onChange={onAvatarChange} id="Avatar" type="file" accept="image/*" />
      <ChangeName htmlFor="Nickname" id="name">
        <Name>
          {/* {user?.displayName ?? "Set nickname"} */}
          {nickname ?? "Set nickname"}
        </Name>
      </ChangeName>
      <NameInput onClick={onNicknameChange} id="Nickname" type="text" />
      {/* delete account btn */}
      <DeleteAccount onClick={deleteAccount} id="deleteAccount">Withdrawal</DeleteAccount>
      {error !== "" ? <Error>{error}</Error> : null}
      <Tweets>
        {tweets.map((tweet) => (<Tweet key={tweet.id} {...tweet} />))}
      </Tweets>
    </Wrapper>
  );
}