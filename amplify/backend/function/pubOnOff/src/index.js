
//const {IoTDataPlaneClient, PublishCommand} = require('@aws-sdk/client-iot-data-plane');

/**
 * send message to AWS IoT Core topic
 * @param topicName
 * @param message
 * @returns {Promise<PublishCommandOutput>}
 */
/*
async function awsIoTCoreMqttPublisher(topicName, message) {
    // https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-your-credentials.html
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/iot-data-plane/
    const client = new IoTDataPlaneClient({
        region: 'ap-southeast-2',
        // optional
        // endpoint: "my-endpoint.eu-west-1.amazonaws.com",
    });
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/iot-data-plane/command/PublishCommand/
    const publishCommand = new PublishCommand({
        topic: topicName,
        payload: JSON.stringify(message),
        qos: 0,
    });

    return client.send(publishCommand);
}

// ---------------- test ----------------
// test topic
const topicName = "ESP8266/sub";
// test message
const message = {
    "@aws-sdk/client-iot": "^3.454.0",
    "@aws-sdk/client-iot-data-plane": "^3.454.0",
    "message": "Hi from lambda",
}
// publish message to topic
const p = awsIoTCoreMqttPublisher(topicName, message)
p.then(
    result => console.log("httpStatusCode:", result.$metadata.httpStatusCode),
    err => console.log("rejected: ", err)
)




exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
        body: JSON.stringify('Hello from Lambda!'),
    };
};
*/

const { IoTDataPlaneClient, PublishCommand } = require('@aws-sdk/client-iot-data-plane');

/**
 * Sends a message to an AWS IoT Core topic
 * @param {string} topicName - The name of the IoT topic
 * @param {string} message - The message to send
 * @returns {Promise<PublishCommandOutput>}
 */
async function awsIoTCoreMqttPublisher(topicName, message) {
    const client = new IoTDataPlaneClient({
        region: 'ap-southeast-2',
    });

    const publishCommand = new PublishCommand({
        topic: topicName,
        payload: JSON.stringify({ message }),
        qos: 0,
    });

    return client.send(publishCommand);
}

exports.handler = async (event) => {
    const { topicName, message } = event.arguments;

    try {
        await awsIoTCoreMqttPublisher(topicName, message);
        return `Message published to topic ${topicName}`;
    } catch (error) {
        console.error(`Failed to publish message: ${error.message}`);
        return `Failed to publish message: ${error.message}`;
    }
};
