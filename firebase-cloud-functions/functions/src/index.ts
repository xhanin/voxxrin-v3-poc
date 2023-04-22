import * as functions from "firebase-functions";

import {initializeApp} from "firebase-admin/app";
import {getFirestore, FieldValue} from "firebase-admin/firestore";

const axios = require('axios');

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
    functions.logger.info("Starting crawling", {structuredData: true});

    crawlDevoxx().then(
        () => {
            functions.logger.info("Crawling done", {structuredData: true});
            response.send("Crawling done!");
        }
    )
});

const crawlDevoxx = async () => {
    for (const day of ["monday", "tuesday", "wednesday", "thursday", "friday"]) {
        await crawlDevoxxDay("dvbe22", day)
    }
}

const crawlDevoxxDay = async (eventId: string, day: string) => {
    const res = await axios.get(`https://${eventId}.cfp.dev/api/public/schedules/${day}`)

    const schedules = res.data;

    for (const schedule of schedules) {
        let title = schedule.proposal?.title || schedule.sessionType.name
        functions.logger.info(`${schedule.id} - ${schedule.room.name} - ${title}`, {structuredData: true});
        functions.logger.info(`/events/${eventId}/days/${day}/schedules/${schedule.id}`, {structuredData: true});

        await db.collection("events").doc(eventId)
            .collection("days").doc(day)
            .collection("schedules").doc(schedule.id.toString())
            .set(schedule)
    }
}
