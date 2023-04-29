import {
    IonAccordionGroup,
    IonHeader,
} from '@ionic/react';

import ScheduleTimeSlot from "./ScheduleTimeSlot"

import './EventDaySchedule.css';

import useDaySchedule from "../hooks/useDaySchedule"

const EventDaySchedule: React.FC = () => {
    const daySchedule = useDaySchedule()

    return (
        <>
        <IonHeader>
            {daySchedule?.day ?? "Loading"}
        </IonHeader>
        <IonAccordionGroup>
            {daySchedule?.timeSlots?.map((s) => <ScheduleTimeSlot timeSlot={s} key={s.id} />)}
        </IonAccordionGroup>
    </>
    );
}

export default EventDaySchedule