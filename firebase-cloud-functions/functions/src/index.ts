import * as functions from "firebase-functions";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//

import {initializeApp} from "firebase-admin/app";
import {getFirestore, FieldValue} from "firebase-admin/firestore";

initializeApp();

const db = getFirestore();

exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
});

exports.onUserMessageInfoUpdate = functions.firestore
    .document("users/{userId}/messages/{messageId}")
    .onUpdate((change, context) => {
        const userId = context.params.userId;
        const messageId = context.params.messageId;
        const wasFavorite = change.before.data().favorite;
        const isFavorite = change.after.data().favorite;
        if (wasFavorite != isFavorite) {
            functions.logger.info(
                `favorite update by ${userId} on ${messageId}: ${wasFavorite} => ${isFavorite}`,
                {structuredData: true});

            return db.collection("messages").doc(messageId)
                .update({favoritesCount: FieldValue.increment(isFavorite ? 1 : -1)});
        } else {
            return false;
        }
    });

exports.onUserMessageInfoCreate = functions.firestore
    .document("users/{userId}/messages/{messageId}")
    .onCreate((change, context) => {
        const userId = context.params.userId;
        const messageId = context.params.messageId;
        const isFavorite = change.data().favorite;
        if (isFavorite) {
            functions.logger.info(
                `favorite create by ${userId} on ${messageId}: => ${isFavorite}`,
                {structuredData: true});

            return db.collection("messages").doc(messageId)
                .update({favoritesCount: FieldValue.increment(1)});
        } else {
            return false;
        }
    });
