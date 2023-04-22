import {
  IonButton,
  IonItem,
  IonLabel,
  IonNote
} from '@ionic/react';
import { Message } from '../data/messages';
import './MessageListItem.css';

interface MessageListItemProps {
  message: Message;
  onToggleFavorite: any;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message, onToggleFavorite }) => {
  return (
    <IonItem detail={false}>
      <div slot="start" className="dot dot-unread"></div>
      <IonLabel className="ion-text-wrap">
        <h2>
          {message.fromName}
          <span className="date">
            <IonNote>{message.date}</IonNote>
          </span>
        </h2>
        <h3>{message.subject}</h3>
        <p>
          Favorites count: {message.favoritesCount}
        </p>
      </IonLabel>
      <IonButton slot="end" onClick={onToggleFavorite}>
        {message.favorite ? "O" : "-"}
      </IonButton>
    </IonItem>
  );
};

export default MessageListItem;
