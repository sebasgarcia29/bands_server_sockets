const { io } = require('../index');

const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Heroes del Silencio'));
bands.addBand(new Band('Metallica'));

io.on('connection', client => {
    console.log('init server');


    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Client disconnected');
    });

    client.on('message', (payload) => {
        console.log('Message', payload);
        io.emit('message', { admin: 'New message' });
    });

    // client.on('emit-message', (payload) => {
    //     //This is the message that the client is sending to the server
    //     // io.emit('new-message', payload);
    //     //This is the message that the server but to less the client
    //     client.broadcast.emit('new-message', payload);
    // });
    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });
    client.on('add-band', (payload) => {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });
    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

});