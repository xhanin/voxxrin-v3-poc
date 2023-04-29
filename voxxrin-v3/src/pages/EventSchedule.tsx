import {
    IonContent,
    IonHeader,
    IonButton,
    IonButtons,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';

import './EventSchedule.css';

import EventDaySchedule from "../components/EventDaySchedule"
import { useState } from 'react';

const EventSchedule: React.FC = () => {
    const [day, setDay] = useState("monday")

    const navToDay = function(d: string) {
        setDay(d)
    }

    const navButtons = ["monday", "tuesday", "wednesday", "thursday", "friday"].map((d:string) => {
        return (
            <IonButton key={d} onClick={() => navToDay(d)}>
                {d[0]}
            </IonButton>
            );
    })
    

    return (
        <IonPage id="home-page">
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                    {navButtons}
                    </IonButtons>
                    <IonTitle>Schedule</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <EventDaySchedule eventId="dvbe22" day={day} />
            </IonContent>
        </IonPage>
    );
}

export default EventSchedule