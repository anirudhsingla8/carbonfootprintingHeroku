const ObjectID = require('mongodb').ObjectID;
const userProfiles = 'user-profiles';

module.exports = function (app,db) {
    // post request to create user registration details
    app.post('/user/register', (req, res) => {
        const body = req.body;
        if (body && body.username && body.firstName && body.lastName && body.email && body.password && body.gender) {
            const userDetails = db.collection(userProfiles);
            userDetails.insert({
                firstName: body.firstName,
                lastName: body.lastName,
                gender: body.gender,
                username: body.username,
                email: body.email,
                password: body.password,
                cards: []
            })
                .then(result => {
                    res.send({
                        status: 'success',
                        message: 'user registration successful',
                    })
                })
                .catch(err => {
                    res.status(400).send({
                        status: 'error',
                        message: err
                    })
                })
        } else {
            res.status(400).send({
                status: 'error',
                message: 'all the fields should be filled'
            });
        }
    });

    // login for user
    app.post('/user/login', (req, res, next) => {
        const body = req.body;
        let email = body.email;
        let password = body.password;
        const userDetails = db.collection(userProfiles);
        userDetails.findOne({email: email}, function (err, user) {
            if (err) {
                return next(err);
            } else if (!user) {
                return res.status(400).send({
                    status: 'error',
                    message: 'user does not exist'
                })
                //res.send('user not found');
            } else {
                if (user.password == password) {

                    req.session.user = user;

                    return res.send({
                        user_obj: user,
                        status: 'success',
                        message: 'Successfully logged in'
                    })
                    //res.send('logged in');
                } else {
                    return res.status(400).send({
                        status: 'error',
                        message: 'Wrong Password'
                    })
                    //res.send('wrong password');
                }
            }

            return res.send(user);
        });
    });

    app.put('/user/add_card/:id?', (req, res) => {
        const body = req.body;
        const UserId = req.params.id;
        const userDetails = db.collection(userProfiles);
        if (body.card_number) {
            const updateObj = {_id: new ObjectID(UserId)};
            userDetails.updateOne(
                updateObj,
                {
                    $push: {
                        cards: {
                            card_number: body.card_number,
                            CVV: body.CVV,
                            expiryYear: body.expiryYear,
                            shopping: parseInt(body.shopping),
                            food: parseInt(body.food)
                        }
                    }
                }
            )
                .then(result => {
                    res.send({
                        user: updateObj,
                        status: 'success',
                        message: 'card successfully added'
                    })
                })
                .catch(err => {
                    res.status(400).send({
                        status: 'error',
                        message: err
                    })
                })
        } else {
            res.status(400).send({
                status: 'error',
                message: 'all the fields should be filled'
            });
        }
    });

    app.get('/user/get_cards/:id?', (req, res) => {
        const UserId = req.params.id;
        const userDetails = db.collection(userProfiles);
        if (UserId) {
            const UserObj = {'_id': new ObjectID(UserId)};
            userDetails
                .find(UserObj)
                .toArray()
                .then(data => {
                    res.send({
                        data: data
                    })
                })
                .catch(err => {
                    res.status(400).send({
                        status: 'error',
                        message: err
                    })
                })
        } else {
            res.send({
                message: 'Please enter User Id'
            })
        }
    })

    app.put('/user/update_card/:id?', (req, res) => {
        const body = req.body;
        const UserId = req.params.id;
        const shopping = parseInt(body.shopping);
        const food = parseInt(body.food);
        const card_number = body.card_number;
        const userDetails = db.collection(userProfiles);
        if (body) {
            const updateObj = {_id: new ObjectID(UserId)};
            userDetails.updateOne(
                {
                    _id: new ObjectID(UserId),
                    'cards.card_number': card_number
                },
                {
                    $inc: {
                        'cards.$.shopping': shopping,
                        'cards.$.food': food
                    }
                }
            )
                .then(result => {
                    res.send({
                        user: updateObj,
                        status: 'success',
                        message: 'card details successfully updated'
                    })
                })
                .catch(err => {
                    res.status(400).send({
                        status: 'error',
                        message: err
                    })
                })
        } else {
            res.status(400).send({
                status: 'error',
                message: 'all the fields should be filled'
            });
        }
    });

    app.get('/user/dashboard',(req, res) => {
        console.log(req);
        if (!req.session.user) {
            return res.status(400).send('need to be logged in');
        }
        return res.status(200).send(req.session.user);
    });

    app.get('/user/logout/', (req,res)=>{
        req.session.destroy();
        return res.status(200).send("user session killed");
    });

}