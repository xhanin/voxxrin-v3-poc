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

const EventSchedule: React.FC = () => {
    const navButtons = ["monday", "tuesday", "wednesday"].map((day:string) => {
        return (
            <IonButton key={day}>
                {day[0]}
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
                <EventDaySchedule />
            </IonContent>
        </IonPage>
    );
}

export default EventSchedule