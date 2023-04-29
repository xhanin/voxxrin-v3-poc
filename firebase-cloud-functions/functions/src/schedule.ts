export interface ScheduleTimeSlot {
    id: string;
    start: string;
    end: string;
}

export interface RoomInfo {
    id: string,
    title: string
}

export interface BreakScheduleTimeSlot extends ScheduleTimeSlot {
    break: {
        title: string,
        room: RoomInfo,
        icon: string
    };
}

export interface ScheduleSpeakerInfo {
    id: string, 
    fullName: string, 
    companyName: string, 
    photoUrl?:string
}

export interface ScheduleTalk {
    id: string;
    title: string;
    language: string;
    track: {id: string, title:string};
    format: {id: string, title:string, duration:string};
    room: RoomInfo;
    speakers: ScheduleSpeakerInfo[]    
}

export interface TalksScheduleTimeSlot extends ScheduleTimeSlot {
    talks: ScheduleTalk[];
}


export interface DaySchedule {
    day: string;
    timeSlots: (BreakScheduleTimeSlot | TalksScheduleTimeSlot)[];
}

export interface Event {
    id: string,
    daySchedules: DaySchedule[]
}