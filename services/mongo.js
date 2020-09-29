const CONNECT_TIMEOUT = 5000;

function MongoService(){
    this._db = null;
    this.ready = new Promise((accept, reject) =>  {
        this.configure = async function(args){
            let connect_timer = setTimeout(()=>{
                reject("Mongo connection timeout, after " + CONNECT_TIMEOUT + 'ms wait');
            }, CONNECT_TIMEOUT);

            require('mongodb').MongoClient
                .connect(args.url, {useUnifiedTopology: true})
                .then(client => {
                    clearTimeout(connect_timer);
                    console.log("Connected successfully to db server");
                    this._db = client.db();
                    accept();
                }, err => {
                    clearTimeout(connect_timer);
                    reject(err);
                });

            return this.ready;
        };
    });
}

MongoService.prototype.collection = function(name){
    return this._db.collection(name);
};

module.exports = MongoService;