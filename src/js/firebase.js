// Firebase 설정 및 초기화
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase 설정 (사용자가 자신의 Firebase 프로젝트 정보로 교체해야 함)
const firebaseConfig = {
    apiKey: "AIzaSyD3gGA5aptM3r_-G6MIF4b4T55DxyBIxRg",
    authDomain: "vibetetris.firebaseapp.com",
    projectId: "vibetetris",
    storageBucket: "vibetetris.firebasestorage.app",
    messagingSenderId: "625356755569",
    appId: "1:625356755569:web:83fc608f98e89c810b41d0"
  };

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 점수 저장 함수
export async function saveScore(playerName, score) {
  try {
    const docRef = await addDoc(collection(db, 'scores'), {
      playerName: playerName,
      score: score,
      timestamp: new Date()
    });
    console.log('점수가 저장되었습니다:', docRef.id);
    return true;
  } catch (error) {
    console.error('점수 저장 중 오류 발생:', error);
    return false;
  }
}

// 상위 랭킹 가져오기 함수
export async function getTopScores(topN = 10) {
  try {
    const scoresQuery = query(
      collection(db, 'scores'),
      orderBy('score', 'desc'),
      limit(topN)
    );
    
    const querySnapshot = await getDocs(scoresQuery);
    const scores = [];
    
    querySnapshot.forEach((doc) => {
      scores.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return scores;
  } catch (error) {
    console.error('랭킹 조회 중 오류 발생:', error);
    return [];
  }
}

// 특정 점수의 순위 가져오기 함수
export async function getScoreRank(score) {
  try {
    const scoresQuery = query(
      collection(db, 'scores'),
      orderBy('score', 'desc')
    );
    
    const querySnapshot = await getDocs(scoresQuery);
    let rank = 1;
    
    querySnapshot.forEach((doc) => {
      if (doc.data().score > score) {
        rank++;
      }
    });
    
    return rank;
  } catch (error) {
    console.error('순위 조회 중 오류 발생:', error);
    return -1;
  }
}
