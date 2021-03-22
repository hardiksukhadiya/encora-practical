module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll(params, user) {
    var sortBy = (params && params.sortBy) ? params.sortBy : "title";
    var sortOrder = (params && params.sortOrder) ? params.sortOrder : "asc";
    var pageNumber = (params && params.pageNumber) ? params.pageNumber : 1;
    var pageSize = (params && params.pageSize) ? params.pageSize : 10;
    var whereCon = { UserId:  user.id}; // will get only current user notes
    return await db.UserNotes.findAndCountAll({
            where: whereCon,
            order: [
                [sortBy, sortOrder]
              ],
            offset: pageNumber == '' ? pageNumber : (parseInt(pageNumber) - parseInt(1)) * parseInt(pageSize),
            limit: parseInt(pageSize)
        });
}

async function getById(id, user) {
    return await getNote(id, user);
}

async function create(params, user) {
    // save note
    await db.UserNotes.create({
        ...params,
        UserId: user.id
    });
}

async function update(id, params, user) {
    const note = await getNote(id, user);
    // copy params to note and save
    Object.assign(note, params);
    await note.save();
    return note.get();
}

async function _delete(id, user) {
    const note = await getNote(id, user);
    await note.destroy();
}

// helper functions
async function getNote(id, user) {
    const note = await db.UserNotes.findOne({
        where: {
            id: id,
            UserId : user.id
        }
    });
    if (!note) throw 'Note not found';
    return note;
}
