const bcrypt = require('bcrypt-as-promised');
const Collections = require('../models/models');

const User = Collections.User;
const Chat = Collections.Chat;
const Documents = Collections.Document;

module.exports = {

    // ######## REGISTRATION ######### //
    register: (req, res) => {
        console.log(req.body)
        if (req.body.password == "" || req.body.password.length < 8) {
            res.json({ status: false, messages: { password: "*Must be at 8 characters" } })
        }

        bcrypt.hash(req.body.password, 10).then((hash_pw, err) => {
            if (err) {
                res.json({ status: false, messages: { server: "*Bcrypt is not working" }, err: err })
<<<<<<< HEAD
            } else {
=======
            }
            else{
>>>>>>> 290fd84587f6ef49d182b3eca8737071f9ef5198
                req.body.password = hash_pw;
                User.create(req.body)
                    .then(
                        user => {
                            req.session.user_id = user._id
                            req.session.logged = true
                            res.json({ status: true, messages: { success: "User successfully Register!" }, user: user })
                        }
                    )
                    .catch(
                        err => {
                            let messages = {}
                            for (let key in err.errors) {
                                messages[key] = err.errors[key].message;
                            }
                            res.json({ status: false, messages: messages });
                        }
                    )
            }
        });
    },  //done

    login: (req, res) => {
        User.findOne({ email: req.body.email }, function (err, user) {
            if (err || user == null) {
                res.json({ status: false, messages: { login: "Email or password invalid." } })
            }
            else {
                bcrypt.compare(req.body.password, user.password)
                    .then((result) => {
                        if (result) {
                            req.session.user_id = user._id
                            req.session.logged = true
                            res.json({ status: true, messages: { success: "Login Sucessful" }, user_id: user._id });
                        }
                        else {
                            res.json({ status: false, messages: { login: "Email or password invalid." } });
                        }
                    })
                    .catch((err) => {
                        res.json({ status: false, messages: { login: "Email or password invalid." } })
                    });
            }
        })
    },  //done

    checkStatus: (req, res) => {
        if (req.session.logged == true && req.session.user_id) {
            res.json({ status: true, user_id: req.session.user_id });
        }
        else {
            res.json({ status: false });
        }
    },

    newDocument: (req, res) => {
        User.findOne({ _id: req.params.UserID })
            .then(
                user => {
                    Documents.create(req.body)
                        .then(
                            document => {
                                Documents.findOneAndUpdate({ _id: document._id }, { $push: { users: user } })
                                    .then(data => res.json({ status: true, messages: { success: "Document successfully create!" }, document: data }))
                                    .catch(err => {
                                        err => {
                                            let messages = {}
                                            for (let key in err.errors) {
                                                messages[key] = err.errors[key].message;
                                            }
                                            res.json({ status: false, messages: messages });
                                        }
                                    });
                            }
                        )
                        .catch(
                            err => {
                                let messages = {}
                                for (let key in err.errors) {
                                    messages[key] = err.errors[key].message;
                                }
                                res.json({ status: false, messages: messages });
                            }
                        )
                }
            )
            .catch(
                err => {
                    let messages = {}
                    for (let key in err.errors) {
                        messages[key] = err.errors[key].message;
                    }
                    res.json({ status: false, messages: messages });
                }
            )
    }, //done

    updatePersonalInfo: (req, res) => {
        User.findOneAndUpdate({ _id: req.params.UserID }, { $set: { first_name: req.body.first_name, last_name: req.body.last_name, user_name: req.body.user_name, email: req.body.email } }, { runValidators: true, context: 'query' })
            .then(
                data => res.json({ status: true, messages: { success: "Personal Info successfully Updated!" }, user: data })
            )
            .catch(
                err => {
                    if (err) {
                        let messages = {}
                        for (let key in err.errors) {
                            messages[key] = err.errors[key].message;
                        }
                        res.json({ status: false, messages: messages });
                    }
                }
            )
    },

    // updatePassword(req, res){

    // }



    deleteDocument: (req, res) => {
        Documents.findByIdAndRemove({ _id: req.params.id })
            .then(
                data => res.json({ status: true, messages: { success: "Document Successfully Deleted!" } })
            )
            .catch(
                err => {
                    let messages = {}
                    for (let key in err.errors) {
                        messages[key] = err.errors[key].message;
                    }
                    res.json({ status: false, messages: messages });
                }
                //or add manual message

            )
    }, //fix error message

    updateTitle: (req, res) => {
        Documents.findOneAndUpdate({ _id: req.params.DocID }, req.boby)
            .then(
                data => {
                    res.json({ status: true, messages: { success: "Document Title Successfully Updated!" } })
                }
            )
            .catch(
                err => {
                    let messages = {}
                    for (let key in err.errors) {
                        messages[key] = err.errors[key].message;
                    }
                    res.json({ status: false, messages: messages });
                }
            )

    },

    addUserToDocument: (req, res) => {
        User.findOne({ _id: req.params.id }) //find by ID or Email
            .then(
                user => {
                    Documents.findOneAndUpdate({ _id: req.params.DocID }, { $push: { users: user } })
                        .then(
                            result => {
                                res.json({ status: true, messages: { success: "User successfully added" } })
                            }
                        )
                        .catch(
                            err => {
                                let messages = {}
                                for (let key in err.errors) {
                                    messages[key] = err.errors[key].message;
                                }
                                res.json({ status: false, messages: messages });
                            }
                        )
                }
            )
            .catch(
                err => {
                    let messages = {}
                    for (let key in err.errors) {
                        messages[key] = err.errors[key].message;
                    }
                    res.json({ status: false, messages: messages });
                }
            )

    }, //maybe fix

    inviteUser: (req, res) => {
        Documents.findOne({ _id: req.params.DocID })
            .then(
                data => {
                    //findby email?
                    User.findOne({ email: req.body })
                        .then(
                            //automated email for invite link to addUserToDocument
                            data => res.json({ status: true, messages: "Invite Link Sent" })
                        )
                        .catch(
                            err => {
                                let messages = {}
                                for (let key in err.errors) {
                                    messages[key] = err.errors[key].message;
                                }
                                res.json({ status: false, messages: messages });
                            }
                        )
                }
            )
            .catch(
                //maybe custom error message?
                err => {
                    let messages = {}
                    for (let key in err.errors) {
                        messages[key] = err.errors[key].message;
                    }
                    res.json({ status: false, messages: messages });
                }
            )
    }, //need more stuff and fix errors

    removeUserFromDoc: (req, res) => {
        Documents.findOneAndUpdate({ _id: req.params.DocID }, { $pull: { users: { _id: user._id } } })
            .then(
                data => {
                    res.json({ status: true, messages: { success: "User Successfully Removed!" } })
                }
            )
            .catch(
                error => {

                    res.json({ status: false, message: error })
                }
            )


    },  //change ID or EMAIL

    all: (req, res) => {
        Product.find({}).sort({ updatedAt: -1 })
            .then(
                data => res.json({ status: true, products: data })
            )
            .catch(
                error => res.json({ status: false, messages: error })
            )
    },

    getOne: (req, res) => {
        User.findOne({ _id: req.params.id })
            .then(
                data => res.json({ status: true, user: data })
            )
            .catch(
                error => res.json({ status: false, messages: error })
            )
    },

    create: (req, res) => {
        Product.create(req.body)
            .then(
                data => res.json({ status: true, messages: { success: "Product successfully added!" }, product: data })
            )
            .catch(
                err => {
                    if (err) {
                        let messages = {}
                        for (let key in err.errors) {
                            messages[key] = err.errors[key].message;
                        }
                        res.json({ status: false, messages: messages });
                    }
                }
            )
    },

    update: (req, res) => {
        Product.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { runValidators: true, context: 'query' })
            .then(
                data => res.json({ status: true, messages: { success: "Product successfully Updated!" }, product: data })
            )
            .catch(
                err => {
                    if (err) {
                        let messages = {}
                        for (let key in err.errors) {
                            messages[key] = err.errors[key].message;
                        }
                        res.json({ status: false, messages: messages });
                    }
                }
            )
    },

    delete: (req, res) => {
        Product.findByIdAndRemove({ _id: req.params.id })
            .then(
                data => res.json({ status: true, messages: { success: "Product successfully Delete!" }, product: data })
            )
            .catch(
                error => req.json({ status: false, messages: error })
            )
    }
}