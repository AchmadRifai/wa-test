import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'wa-test',
    brokers: ['localhost:9092']
});

export const producing = async (topic: string, value: string) => {
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({ topic, messages: [{ value }] });
    await producer.disconnect();
}

export const consuming = async (topic: string, callback: (msg: string) => Promise<void>) => {
    const consumer = kafka.consumer({ groupId: 'wa-group' });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ message, partition }) => {
            await consumer.commitOffsets([{ partition, offset: message.offset, topic }]);
            try {
                if (message.value) await callback(message.value?.toString());
            } catch (e) {
                console.log(e);
            }
        },
        partitionsConsumedConcurrently: 1
    });
}
