class User {
    constructor(role, name, lastname, id) {
        this._role = role;
        this.name = name;
        this.lastname = lastname;
        this._id = id;
    }

    getId() {
        return this._id;
    }

    getRole() {
        return this._role;
    }
}

export default User;