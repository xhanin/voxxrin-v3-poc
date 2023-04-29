import { useState, useEffect } from 'react';

import {
    CACHE_SIZE_UNLIMITED,
    collection,
    doc,
    getDoc,
    getFirestore,
    initializeFirestore,
    onSnapshot,
    persistentLocalCache,
    persistentMultipleTabManager,
    query,
    setDoc,
    where
} from "firebase/firestore";

import {db} from "../firebase"
import {DaySchedule} from "../data/schedule"


export default function useDaySchedule() {
    const [daySchedule, setDaySchedule] = useState(null as DaySchedule | null);
    const eventId: string = "dvbe22"
    const day: string = "wednesday"

    useEffect(() => {
        const d = doc(db, `events/${eventId}/days/${day}`)
        const unsubscribe = onSnapshot(d, docSnapshot => {
            console.log(`Received doc snapshot: ${docSnapshot}`);
            setDaySchedule(docSnapshot.data() as DaySchedule)
          }, err => {
            console.log(`Encountered error: ${err}`);
          });
      return unsubscribe;
    }, []);
    return daySchedule;
  }