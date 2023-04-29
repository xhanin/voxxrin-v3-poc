import {    
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonBadge
} from '@ionic/react';

import {ScheduleTalk} from "../data/schedule"
import useTalkStats from '../hooks/useTalkStats';

interface ScheduleTalkItemProps {
    eventId: string,
    talk: ScheduleTalk;
}

const ScheduleTalkItem: React.FC<ScheduleTalkItemProps> = ({eventId, talk}) => {
    const talkStats = useTalkStats({eventId: eventId, talkId: talk.id})

    return (
        <IonCard key={talk.id}>
        <IonCardHeader>
          <IonCardTitle>{talk.title}</IonCardTitle>
          <IonCardSubtitle>{talk.track.title}</IonCardSubtitle>
        </IonCardHeader>
    
        <IonCardContent>
          {talk.room.title}
          <IonBadge slot="end">{talkStats?.totalFavoritesCount ?? "0"}</IonBadge>
        </IonCardContent>
      </IonCard>
    );
}

export default ScheduleTalkItem;