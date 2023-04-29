import * as functions from "firebase-functions";
import * as _ from "lodash";

import {initializeApp} from "firebase-admin/app";
import {getFirestore, FieldValue} from "firebase-admin/firestore";
import {info} from "./firebase"
import {crawl as crawlDevoxx} from "./crawlers/devoxx/crawler"
import {Event} from "./schedule"

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


exports.crawl = functions.https.onRequest((request, response) => {
    info("Starting crawling");

    crawlDevoxx("dvbe22").then(
        (event: Event) => {
            saveEvent(event).then(() => {
                info("Crawling done");
                response.send(JSON.stringify(event, null, 2));
            })
        }
    )
});

const saveEvent = async function(event: Event) {
    for (const daySchedule of event.daySchedules) {
        await db.collection("events").doc(event.id)
        .collection("days").doc(daySchedule.day)
            .set(daySchedule)
    }
}