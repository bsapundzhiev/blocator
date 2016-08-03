var MessageType = {
    SERVICE: 1,
    SERVICE_CMD: 2,
    BROADCAST: 3
};

var Message = {

    data: null,

    setData: function(client, msgType, msg) {

        this.data = {
            id : client.id,
            type: msgType,
            user: client.name,
            message: msg
        };
    },
    parse: function(JSONstr) {

        this.data = JSON.parse(JSONstr);
    },
    getData: function() {

        return JSON.stringify(this.data);
    },

    getType: function() {

        return this.data.type;
    },

    getUser: function() {

        return this.data.user;
    }
};