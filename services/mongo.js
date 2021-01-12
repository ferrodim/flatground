const CONNECT_TIMEOUT = 5000;
const mongodb = require('mongodb');

class MongoService extends Function {
    constructor() {
        super('...args', 'return this.__self__.__call__(...args)')
        let self = this.bind(this)
        this.__self__ = self
        this._db = null;
        let _accept, _reject;
        this.ready = new Promise((accept, reject) =>  {
            _accept = accept;
            _reject = reject;
        });
        this.ready.accept = _accept;
        this.ready.reject = _reject;
        return self
    }

    __call__(name) {
        return this.collection(name);
    }

    collection(name){
        return this._db.collection(name);
    };

    configure(args){
        let connect_timer = setTimeout(()=>{
            this.ready.reject("Mongo connection timeout, after " + CONNECT_TIMEOUT + 'ms wait');
        }, CONNECT_TIMEOUT);

        mongodb.MongoClient
            .connect(args.url, {useUnifiedTopology: true})
            .then(client => {
                clearTimeout(connect_timer);
                console.log("Connected successfully to db server");
                this._db = client.db();
                this.ready.accept();
            }, err => {
                clearTimeout(connect_timer);
                this.ready.reject(err);
            });

        return this.ready;
    }
}

module.exports = MongoService;