function RabbitService(){
    this.channel = null;
    this.ready = new Promise((accept, reject) =>  {
        this.configure = async function(args){
            let connect = await require('amqplib').connect(args.url);
            this.channel = await connect.createChannel();
            accept();
            return this.ready;
        };
    });
}

RabbitService.prototype.bind = async function(queueName, routeKey, callback){
    await this.channel.assertExchange('topic', 'topic');
    await this.channel.assertQueue(queueName);
    if (Array.isArray(routeKey)){
        for (let route of routeKey){
            await this.channel.bindQueue(queueName, 'topic', route);
        }
    } else {
        await this.channel.bindQueue(queueName, 'topic', routeKey);
    }

    this.channel.consume(queueName, async msg => {
        if (msg){
            let event = JSON.parse(msg.content.toString());
            console.log('{Rabbit} <= ' + JSON.stringify(event));
            await callback(event);
        }
        this.channel.ack(msg);
    });
};

RabbitService.prototype.emit = function(event){
    let outStr = JSON.stringify(event);
    console.log('{Rabbit} => ' + outStr);
    this.channel.publish('topic', event.event, Buffer.from(outStr, 'utf8'));
};

module.exports = RabbitService;