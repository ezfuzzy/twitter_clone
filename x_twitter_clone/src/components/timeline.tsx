import { orderBy, query, collection, onSnapshot, limit } from "firebase/firestore";
import { styled } from "styled-components";
import { useState, useEffect } from "react";
import { db } from "../routes/firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 10px; 
  }

  &::-webkit-scrollbar-thumb {/*scroll bar */
    background-image: -webkit-gradient(linear,
                  left bottom,
                  left top,
                  color-stop(0.44, rgb(122,153,217)),
                  color-stop(0.72, rgb(73,125,189)),
                  color-stop(0.86, rgb(54,84,255)));
    border-radius: 10px; 
  }

  &::-webkit-scrollbar-track {/* track of scroll bar */
    background-color: #000000; 
  }

`;



export default function Timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);
  // call only need 
  useEffect(() => { // realtime
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      // gen query
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25),
      );
  
      // 데이터베이스 - 쿼리 실시간 연결 : 삭제, 추가, 갱신시 쿼리에 알려줌 (add Event listener)
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => { // map : make arr
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return { // > tweets object 
              tweet, createdAt, userId, username, photo,
              id: doc.id,
          };
        });
        setTweet(tweets);   
      });
    };
    fetchTweets();
        // useEffect's tear down, clean-up 
        // unmount > return & cleanup -> incase: move to {profile} page
    return () => {
        unsubscribe && unsubscribe();
    }
  }, []);
    // tweet에서 id 클릭하면 프로필페이지 들어갈 수 있게 하기
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}