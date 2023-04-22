import MessageListItem from '../components/MessageListItem';
import {useEffect, useState} from 'react';
import {Message} from '../data/messages';
import {
    IonContent,
    IonHeader,
    IonList,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Home.css';

import {initializeApp} from "firebase/app";
import {
    CACHE_SIZE_UNLIMITED,
    collection,
    getDocs,
    getFirestore,
    initializeFirestore,
    onSnapshot,
    persistentLocalCache,
    persistentMultipleTabManager,
    query,
    where
} from "firebase/firestore";


const firebaseConfig = {
    apiKey: "---",
    authDomain: "voxxrin-v3-poc.firebaseapp.com",
    projectId: "voxxrin-v3-poc",
    storageBucket: "voxxrin-v3-poc.appspot.com",
    messagingSenderId: "20680838449",
    appId: "1:20680838449:web:9049ca9161983d0b0d3410"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeFirestore(app,
    {
        localCache:
            persistentLocalCache({
                tabManager: persistentMultipleTabManager(),
                cacheSizeBytes: CACHE_SIZE_UNLIMITED
            }),
    });

const db = getFirestore(app);

const msgConverter = {
    toFirestore: (msg: Message) => {
        return {
            fromName: msg.fromName,
            subject: msg.subject,
            date: msg.date
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return {
            fromName: data.fromName,
            subject: data.subject,
            date: data.date,
            id: snapshot.id as Number
        } as Message;
    }
};


const Home: React.FC = () => {

    const [messages, setMessages] = useState<Message[]>([]);

    const fetchMessages = async () => {
        const q = query(collection(db, "messages"), where("fromName", "!=", "Nobody"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fMessages: Message[] = []
            querySnapshot.forEach((doc) => {
                let m = msgConverter.fromFirestore(doc, {})
                fMessages.push(m)
                console.log(`refreshed firestore: ${doc.id} => ${m.fromName} ${m.subject} ${m.date}`);
            });
            setMessages(fMessages);
        });
    };

    useEffect(() => {
        fetchMessages()
    }, []);

    const refresh = (e: CustomEvent) => {
        setTimeout(() => {
            e.detail.complete();
        }, 3000);
    };

    return (
        <IonPage id="home-page">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Inbox</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={refresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">
                            Inbox
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonList>
                    {messages.map(m => <MessageListItem key={m.id} message={m}/>)}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Home;
