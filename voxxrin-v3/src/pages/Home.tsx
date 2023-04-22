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

import {Device} from '@capacitor/device';

const logDeviceInfo = async () => {
    const info = await Device.getInfo();

    console.log(info);

    const id = await Device.getId();
    console.log(id)
};

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
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return {
            fromName: data.fromName,
            subject: data.subject,
            date: data.date,
            id: snapshot.id as Number,
            favoritesCount: (data.favoritesCount ?? 0) as Number,
            favorite: false
        } as Message;
    }
};


const Home: React.FC = () => {

    const [messages, setMessages] = useState<Message[]>([]);

    const updateMessages = async (messages: Message[]) => {
        const deviceId = await Device.getId()
        const fMessages: Message[] = []

        for (const m of messages) {
            const docRef = doc(db, `users/${deviceId.uuid}/messages/${m.id}`);
            const docSnap = await getDoc(docRef);
            m.favorite = docSnap?.data()?.favorite ?? false
            fMessages.push(m)
            console.log(`refreshed firestore: ${m.id} => ${m.fromName} ${m.subject} ${m.date}`);
        }

        setMessages(fMessages);
    }
    const fetchMessages = async () => {
        const q = query(collection(db, "messages"), where("fromName", "!=", "Nobody"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            updateMessages(querySnapshot.docs.map((d) => {
                return msgConverter.fromFirestore(d, {})
            }))
        });
    };

    useEffect(() => {
        logDeviceInfo()
        fetchMessages()
    }, []);

    const refresh = (e: CustomEvent) => {
        setTimeout(() => {
            e.detail.complete();
        }, 3000);
    };

    async function toggleFavorite(msgId: number) {
        const fMessages: Message[] = []
        for (const m of messages) {
            if (m.id == msgId) {
                m.favorite = !m.favorite
                const deviceId = await Device.getId()
                setDoc(doc(db, `users/${deviceId.uuid}/messages/${m.id}`), {
                    favorite: m.favorite
                }).then(() => {
                    console.log(`toggled favorite on firestore for ${msgId} - ${m.favorite}`)
                })
            }
            fMessages.push(m)
        }
        setMessages(fMessages);
    }

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
                    {messages.map(m => <MessageListItem key={m.id} message={m}
                                                        onToggleFavorite={() => toggleFavorite(m.id)}/>)}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Home;
